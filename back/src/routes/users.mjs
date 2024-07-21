import express from "express";
import { authValidator, userValidator } from "../validator/userValidator.mjs";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { sendConfirmationEmail } from "../utils/mailer.mjs";
import { generateConfirmationToken } from "../utils/jwt.mjs";
import { shouldBeAdmin, shouldBeAuthenticate } from "../middlewares/authentication.mjs";
import { anonymizeUserData } from "../utils/anonym.mjs";
import User from "../models/User.mjs";
import { getNewUsersOverTime, getTotalRevenue, getTotalRevenuePerDate, getTotalUsers } from "../utils/stats.mjs";

const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get("/users/me", shouldBeAuthenticate, async (req, res) => {
    try {
        const user = await User.findOne({
            id: req.user.id,
        }).select("-password");

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        return res.status(200).json({
            status: 200,
            data: user
        });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.post("/users", authValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                status: 422,
                message: errors.formatWith(({ msg, path }) => {
                    return {
                        msg,
                        path
                    }
                }).array()
            });
        }

        const { email, password, firstname, lastname } = req.body;

        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ status: 400, message: "L'utilisateur existe déjà." });
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
                id: true
            }
        })

        const confirmationToken = generateConfirmationToken(user.id)
        await sendConfirmationEmail(email, confirmationToken);

        return res.json({ status: 201, data: user });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
});

router.get("/users", async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search !== undefined && search !== "") {
            const searchQuery = new RegExp(search, 'i');
            query.$or = [
                { email: { $regex: searchQuery } },
                { firstname: { $regex: searchQuery } },
                { lastname: { $regex: searchQuery } }
            ]
        }

        const users = await User.findToClient(query, page, limit);

        const count = await User.countDocuments(query);

        return res.status(200).json({
            status: 200,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count,
            data: users
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get("/users/stats", shouldBeAdmin, async (req, res) => {
    try {
        const totalUsers = await getTotalUsers();
        const newUsers = await getNewUsersOverTime();
        const totalRevenue = await getTotalRevenue();
        const totalRevenuePerDate = await getTotalRevenuePerDate();

        return res.status(200).json({
            status: 200,
            data: {
                totalUsers,
                newUsers,
                totalRevenue,
                totalRevenuePerDate
            }
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get("/users/:id", async (req, res) => {
    const id = req.params.id

    try {

        const user = await User.findOne({
            id,
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        return res.status(200).json({
            status: 200,
            data: user.toClient()
        })
    } catch (error) {
        console.log("🚀 ~ router.get ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.put("/users/:id", userValidator, async (req, res) => {
    const id = req.params.id

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).send({
            status: 401,
            message: errors.formatWith(({ msg, path }) => {
                return {
                    msg,
                    path
                }
            }).array()
        });
    }

    const { email, firstname, lastname, phone, has_confirmed_account, number_connexion_attempts, role } = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                email,
                firstname,
                lastname,
                phone: phone ?? null,
                has_confirmed_account, 
                number_connexion_attempts, 
                role
            },
            select: {
                email: true,
                firstname: true,
                lastname: true,
                created_at: true,
                id: true,
                phone: true,
            }
        })

        return res.status(200).json({
            status: 200,
            data: updatedUser
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.delete("/users/:id", shouldBeAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const user = await db.user.findUnique({
            where: {
                id,
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        if (user.deleted_at !== null) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        await db.user.update({
            where: {
                id: postgresId
            },
            data: anonymizeUserData()
        })

        return res.status(200).json({
            status: 200,
            message: "Compte supprimé avec succès"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;