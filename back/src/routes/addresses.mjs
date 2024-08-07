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

router.post("/users/:userId/addresses", addressValidator, shouldBeAuthenticate, async (req, res) => {
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

        const { userId } = req.params;
        const { city, country, postal_code, address, is_selected, other } = req.body;

        const newAddress = await db.address.create({
            data: {
                city,
                country,
                postal_code,
                address,
                is_selected: Boolean(is_selected) ?? false, 
                other,
                user_id: userId
            }
        })

        if(Boolean(is_selected)) {
            const addresses = await db.address.findMany({
                where: {
                    user_id: newAddress.user_id,
                    id: {
                        not: newAddress.id
                    }
                }
            })

            for (let i = 0; i < addresses.length; i++) {
                const element = addresses[i];
                await db.address.update({
                    where: {
                        id: element.id
                    },
                    data: {
                        ...element,
                        is_selected: false
                    }
                })
            }
        }

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

router.get('/addresses/:id', shouldBeAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const address = await db.address.findUnique({ where: { id } });
      if (!address) {
        return res.status(404).json({ status: 404, message: 'Address not found' });
      }
      res.json({ status: 200, data: address });
    } catch (error) {
      res.status(400).json({ status: 400, message: 'Bad Request' });
    }
});

router.put("/addresses/:id", shouldBeAuthenticate, addressValidator, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
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

        const { city, country, postal_code, address, is_selected, other } = req.body;

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

        if (existingAddress.user_id !== user.id && user.role !== "ROLE_ADMIN") {
            return res.status(400).json({ status: 400, message: "You don't have access to this ressource" });
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
                is_selected: Boolean(is_selected) ?? existingAddress.is_selected, 
                other
            }
        });

        if(Boolean(is_selected)) {
            const addresses = await db.address.findMany({
                where: {
                    user_id: existingAddress.user_id,
                    id: {
                        not: id
                    }
                }
            })

            for (let i = 0; i < addresses.length; i++) {
                const element = addresses[i];
                await db.address.update({
                    where: {
                        id: element.id
                    },
                    data: {
                        ...element,
                        is_selected: false
                    }
                })
            }
        }

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
  
    try {
      const existingAddress = await db.address.findUnique({ where: { id } });
      if (!existingAddress) {
        return res.status(404).json({ status: 404, message: 'Address not found' });
      }
  
      const updatedAddress = await db.address.update({
        where: { id },
        data: { city, country, postal_code, address, is_selected, other }
      });
  
      res.json({ status: 200, data: updatedAddress });
    } catch (error) {
      res.status(422).json({ status: 422, message: 'Unprocessable Entity' });
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

        if (address.user_id !== user.id && user.role!== "ROLE_ADMIN") {
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