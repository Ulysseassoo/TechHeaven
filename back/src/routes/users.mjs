import express from "express";
import { authValidator, userValidator } from "../validator/userValidator.mjs";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { sendConfirmationEmail } from "../utils/mailer.mjs";
import { generateConfirmationToken } from "../utils/jwt.mjs";
import {
  shouldBeAdmin,
  shouldBeAuthenticate,
  checkFields,
} from "../middlewares/authentication.mjs";
import { anonymizeUserData } from "../utils/anonym.mjs";
import User from "../models/User.mjs";
import {
  getNewUsersOverTime,
  getTotalRevenue,
  getTotalRevenuePerDate,
  getTotalUsers,
  getCountUsersByNotificationType,
  getAverageOrderValue,
  getUserConversionRate
} from "../utils/stats.mjs";
import Order from "../models/Order.mjs";

const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get("/users/:id/orders", shouldBeAuthenticate, async (req, res) => {
  try {
    
    const user = await User.findOne({
      id: req.user.id,
    });

    if(req.params.id !== req.user.id) {
      return res
       .status(403)
       .json({ status: 403, message: "Vous n'avez pas accès à cette ressource" });
    }

    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Utilisateur inexistant." });
    }


    const { search } = req.query;
    const query = {};

    if (search !== undefined && search !== "") {
      const searchQuery = new RegExp(search, "i");
      query.$or = [
        { id: { $regex: searchQuery } },
        { "order_details.product_name": { $regex: searchQuery } },
      ];
    }

    const orders = await Order.find({ user_id: user.id, ...query }).populate('order_details');

    return res.status(200).json({
      status: 200,
      data: orders,
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
})

router.get("/users/me", shouldBeAuthenticate, async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.user.id,
    })
      .select("-password")
      .populate({
        path: "preferences",
        populate: {
          path: "alert",
        },
      });

    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Utilisateur inexistant." });
    }

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

router.post("/users", authValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        status: 422,
        message: errors
          .formatWith(({ msg, path }) => {
            return {
              msg,
              path,
            };
          })
          .array(),
      });
    }

    const { email, password, firstname, lastname } = req.body;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "L'utilisateur existe déjà." });
    }

    const user = await db.user.create({
      data: {
        email,
        firstname,
        lastname,
        password,
        last_updated_password: new Date(),
        role: "ROLE_USER",
      },
      select: {
        email: true,
        firstname: true,
        lastname: true,
        id: true,
      },
    });

    await db.cart.create({
      data: {
          user_id: user.id
      }
  })

    // Create preference for user
    const alert = await db.alert.findFirst({
      where: {
        type: "NEWSLETTER",
      },
    });

    if (alert) {
      await db.preference.create({
        data: {
          user_id: user.id,
          alert_id: alert.id,
          isEnabled: false,
        }
      });
    }

    const alerts = await db.alert.findMany({
      where: {
        id: {
          not: alert.id
        }
      }
    });

    for (let j = 0; j < alerts.length; j++) {
      const z = alerts[j];
      await db.preference.create({
        data: {
          user_id: user.id,
          alert_id: z.id,
          isEnabled: false,
        },
      });
    }

    const confirmationToken = generateConfirmationToken(user.id);
    await sendConfirmationEmail(email, confirmationToken);

    return res.json({ status: 201, data: user });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

router.get("/users", shouldBeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search !== undefined && search !== "") {
      const searchQuery = new RegExp(search, "i");
      query.$or = [
        { email: { $regex: searchQuery } },
        { firstname: { $regex: searchQuery } },
        { lastname: { $regex: searchQuery } },
      ];
    }

    const users = await User.findToClient(query, page, limit);

    const count = await User.countDocuments(query);

    return res.status(200).json({
      status: 200,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count,
      data: users,
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

router.get("/users/stats", shouldBeAdmin, async (req, res) => {
  try {
    const totalUsers = await getTotalUsers();
    const newUsers = await getNewUsersOverTime();
    const totalRevenue = await getTotalRevenue();
    const totalRevenuePerDate = await getTotalRevenuePerDate();
    const totalUsersByNotificationType = await getCountUsersByNotificationType();
    const averageOrder = await getAverageOrderValue();
    const userConversionRate = await getUserConversionRate();

    return res.status(200).json({
      status: 200,
      data: {
        totalUsers,
        newUsers,
        totalRevenue,
        totalRevenuePerDate,
        totalUsersByNotificationType,
        averageOrder,
        userConversionRate
      },
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

router.get("/users/:id", shouldBeAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      id,
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Utilisateur inexistant." });
    }

    return res.status(200).json({
      status: 200,
      data: user.toClient(),
    });
  } catch (error) {
    console.log("🚀 ~ router.get ~ error:", error);
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

router.put(
  "/users/:id",
  shouldBeAuthenticate,
  checkFields(["email", "firstname", "lastname", "phone"]),
  userValidator,
  async (req, res) => {
    const id = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        status: 422,
        message: errors
          .formatWith(({ msg, path }) => {
            return {
              msg,
              path,
            };
          })
          .array(),
      });
    }

    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: "Utilisateur inexistant." });
      }

      if(user.id !== req.user.id && req.user.role !== "ROLE_ADMIN") {
        return res
         .status(403)
         .json({ status: 403, message: "Vous n'avez pas accès à cette ressource" });
      }

      const updatedUser = await db.user.update({
        where: {
          id,
        },
        data: {
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone ?? null,
          has_confirmed_account: req.body.has_confirmed_account ?? req.user.has_confirmed_account,
          created_at: req.body.created_at ?? req.user.created_at,
          deleted_at: req.body.deleted_at ?? req.user.deleted_at,
          blocked_until: req.body.blocked_until ?? req.user.blocked_until,
          number_connexion_attempts: req.body.number_connexion_attempts ?? req.user.number_connexion_attempts,
          role: req.body.role ?? req.user.role,
        },
        select: {
          email: true,
          firstname: true,
          lastname: true,
          created_at: true,
          id: true,
          phone: true,
        },
      });

      return res.status(200).json({
        status: 200,
        data: updatedUser,
      });
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: error.message || error,
      });
    }
  }
);

router.delete("/users/:id", shouldBeAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Utilisateur inexistant." });
    }

    if (user.deleted_at !== null) {
      return res
        .status(400)
        .json({ status: 400, message: "Utilisateur inexistant." });
    }

    if (user.id !== req.user.id && req.user.role !== "ROLE_ADMIN") {
      return res
        .status(401)
        .json({ status: 401, message: "Vous n'avez pas accès à cette route." });
    }

    await db.user.update({
      where: {
        id,
      },
      data: anonymizeUserData(),
    });

    return res.status(200).json({
      status: 200,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message,
    });
  }
});

router.put(
  "/users/:id/alerts/:alertId/preferences/:preferenceId",
  shouldBeAuthenticate,
  async (req, res) => {
    try {
      const { id, alertId, preferenceId } = req.params;

      if (req.user.id !== id) {
        return res.status(401).json({
          status: 401,
          message: "Vous n'avez pas accès à cette route.",
        });
      }

      const preference = await db.preference.findUnique({
        where: {
          id: preferenceId,
          alert_id: alertId,
        },
      });

      if (!preference) {
        return res
          .status(404)
          .json({ status: 404, message: "Préférence inexistante." });
      }

      const updatedPreference = await db.preference.update({
        where: {
          id: preference.id,
        },
        data: {
          ...preference,
          isEnabled: !preference.isEnabled,
        },
      });

      return res.status(200).json({
        status: 200,
        data: updatedPreference,
      });
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: error.message || error,
      });
    }
  }
);

router.post(
  "/users/:id/alerts/:alertId/preferences",
  shouldBeAuthenticate,
  async (req, res) => {
    try {
      const { id, alertId } = req.params;

      if (req.user.id !== id) {
        return res.status(401).json({
          status: 401,
          message: "Vous n'avez pas accès à cette route.",
        });
      }

      const preference = await db.preference.create({
        data: {
          isEnabled: req.body.isEnabled,
          alert_id: alertId,
          user_id: id,
        },
      });

      return res.status(201).json({
        status: 201,
        data: preference,
      });
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: error.message || error,
      });
    }
  }
);

export default router;
