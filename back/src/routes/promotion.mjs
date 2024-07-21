import express from "express";
import { userValidator } from "../validator/userValidator.mjs";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";
import { randomBytes } from 'crypto';
import Promotion from "../models/Promotion.mjs";
import { promotionValidator } from '../validator/promotionValidator.mjs'

const router = express.Router();

router.get("/promotions", shouldBeAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search !== undefined && search !== "") {
            const searchQuery = new RegExp(search, 'i');
            query.$or = [
                { type: { $regex: searchQuery } },
            ]
        }

        const promotions = await Promotion.findToClient(query, page, limit);

        const count = await Promotion.countDocuments(query);

        return res.status(200).json({
            status: 200,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count,
            data: promotions
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get("/promotions/:id", async (req, res) => {
    const id = req.params.id

    try {

        const promotion = await Promotion.findOne({
            id,
        })

        if (!promotion) {
            return res.status(400).json({ status: 400, message: 'Promotion inexistant.' });
        }

        return res.status(200).json({
            status: 200,
            data: promotion
        })
    } catch (error) {
        console.log("🚀 ~ router.get ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.post("/promotions", promotionValidator, shouldBeAdmin, async (req, res) => {
    try {

        const { is_one_time, expiry_date } = req.body
        const type = randomBytes(6).toString('hex').slice(0, 6)

        const promotion = await db.promotion.create({
            data: {
                is_one_time,
                expiry_date,
                type,
                created_at: new Date(),
            },
            select: {
                id: true,
                is_one_time: true,
                expiry_date: true,
                type: true,
                created_at: true
            }
        })

        return res.status(201).json({
            status: 201,
            data: promotion
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.put("/promotions/:id", promotionValidator, shouldBeAdmin, async (req, res) => {
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

    const { isOneTime, expiryDate } = req.body;

    try {
        const promotion = await db.promotion.findUnique({
            where: {
                id
            }
        })

        if (!promotion) {
            return res.status(400).json({ status: 400, message: 'Promotion inexistant.' });
        }

        const updatedPromotion = await db.promotion.update({
            where: {
                id
            },
            data: {
                isOneTime,
                expiryDate,
            },
            select: {
                isOneTime: true,
                expiryDate: true,
                created_at: true,
                id: true,
                type: true,
            }
        })

        return res.status(200).json({
            status: 200,
            data: updatedPromotion
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.delete("/promotions/:id", shouldBeAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const promotion = await db.promotion.findUnique({
            where: {
                id,
            }
        })

        if (!promotion) {
            return res.status(400).json({ status: 400, message: 'Promotion inexistant.' });
        }

        await db.promotion.delete({
            where: {
                id
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Promotion supprimé avec succès"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;