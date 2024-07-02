import User from "../models/User.mjs";
import express from "express";
import { addressValidator } from "../validator/addressValidator.mjs";
import { db } from "../utils/db.server.mjs";
import { validationResult } from "express-validator";
import { shouldBeAdmin, shouldBeAuthenticate } from "../middlewares/authentication.mjs";


const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get("/addresses", shouldBeAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search !== undefined && search !== "") {
            const searchQuery = new RegExp(search, 'i');
            query.$or = [
                { 'addresses.address': { $regex: searchQuery } },
                { 'addresses.other': { $regex: searchQuery } },
                { 'addresses.city': { $regex: searchQuery } },
                { 'addresses.postal_code': { $regex: searchQuery } },
                { 'addresses.country': { $regex: searchQuery } },
                { 'firstname': { $regex: searchQuery } },
                { 'lastname': { $regex: searchQuery } }
              ];
        }

        const { addresses, totalCount, totalPages } = await User.findAddresses(query, parseInt(page), parseInt(limit));

        return res.status(200).json({
            status: 200,
            totalPages,
            currentPage: parseInt(page),
            totalCount,
            data: addresses
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.post("/addresses", addressValidator, async (req, res) => {
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

        const { city, country, postal_code, address, is_selected, other, user_id } = req.body;

        const newAddress = await db.address.create({
            data: {
                city,
                country,
                postal_code,
                address,
                is_selected: is_selected ?? false, 
                other,
                user_id
            }
        })

        return res.status(201).json({
            status: 201,
            data: newAddress
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get("/addresses/:id", shouldBeAuthenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const address = await db.address.findUnique({
            where: {
                id
            }
        });

        if (!address) {
            return res.status(404).send({
                status: 404,
                message: "Address not found"
            });
        }

        if (address.user_id !== user.id) {
            return res.status(400).json({ status: 400, message: "You don't have access to this ressource" });
        }

        return res.status(200).json({
            status: 200,
            data: address
        });

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
});

router.put("/addresses/:id", addressValidator, async (req, res) => {
    try {
        const { id } = req.params;
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

        const { city, country, postal_code, address, is_selected, other, user_id } = req.body;

        const existingAddress = await db.address.findUnique({
            where: {
                id
            }
        });

        if (!existingAddress) {
            return res.status(404).send({
                status: 404,
                message: "Address not found"
            });
        }

        const updatedAddress = await db.address.update({
            where: {
                id
            },
            data: {
                ...existingAddress,
                city,
                country,
                postal_code,
                address,
                is_selected: is_selected ?? existingAddress.is_selected, 
                other
            }
        });

        return res.status(200).json({
            status: 200,
            data: updatedAddress
        });

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
});

router.delete("/addresses/:id", shouldBeAuthenticate, async (req, res) => {
    const id = req.params.id
    const user = req.user

    try {
        const address = await db.address.findUnique({
            where: {
                id,
            }
        })

        if(!address) {
            return res.status(404).json({ status: 404, message: "Addresse introuvable" });
        }

        if (address.user_id !== user.id) {
            return res.status(400).json({ status: 400, message: "You don't have access to this ressource" });
        }

        await db.address.delete({
            where: {
                id
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Addresse supprimé avec succès"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;