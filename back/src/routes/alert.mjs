import express from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { createAlertValidator } from "../validator/alertValidator.mjs";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";
import Alert from "../models/Alert.mjs";

const router = express.Router();

router.post(
  "/alerts",
  shouldBeAdmin,
  createAlertValidator,
  async (req, res) => {
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

    const { name, type } = req.body;

    try {
      const alert = await db.alert.create({
        data: {
          name,
          type,
        },
      });
      return res.status(201).json({
        status: 201,
        data: alert,
      });
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: error.message || error,
      });
    }
  }
);

router.get("/alerts", shouldBeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search !== undefined && search !== "") {
      const searchQuery = new RegExp(search, "i");
      query.$or = [
        { name: { $regex: searchQuery } },
        { type: { $regex: searchQuery } },
      ];
    }

    const alerts = await Alert.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Alert.countDocuments(query);

    return res.status(200).json({
      status: 200,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count,
      data: alerts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching alerts", error: error.message });
  }
});

router.get("/alerts/:id", shouldBeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await db.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      res.status(404).json({ message: "Alert not found" });
    }

    return res.json(alert);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching alert", error: error.message });
  }
});

router.put(
  "/alerts/:id",
  createAlertValidator,
  shouldBeAdmin,
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

    const { name, type, param } = req.body;

    try {
      const alert = await db.alert.update({
        where: { id },
        data: {
          name,
          type,
          param,
        },
      });

      return res.status(200).json({
        status: 200,
        data: alert,
      });
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: error.message || error,
      });
    }
  }
);

router.delete("/alerts/:id", shouldBeAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const alert = await db.alert.findUnique({
      where: {
        id,
      },
    });

    if (!alert) {
      return res
        .status(404)
        .json({ status: 404, message: "Alerte introuvable" });
    }

    await db.alert.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message,
    });
  }
});

export default router;
