import express from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { shouldBeAuthenticate } from "../middlewares/authentication.mjs";
import Basket from "../models/Cart.mjs";
import CartHasProducts from '../models/CartHasProduct.mjs'
import { basketValidator } from '../validator/basketValidator.mjs'

const router = express.Router();

router.get("/basket/:id", shouldBeAuthenticate, async (req, res) => {
    const id = req.params.id

    try {

        const basket = await db.cart.findUnique({
            where: {
                id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        if (!(req.user.id === basket.user_id)) {
            return res.status(401).json({ status: 401, message: "Vous ne pouvez pas intéragir avec ce panier." });
        }

        return res.status(200).json({
            status: 200,
            data: basket
        })
    } catch (error) {
        console.log("🚀 ~ router.get ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.put("/basket/:id", basketValidator, shouldBeAuthenticate, async (req, res) => {
    const id = req.params.id
    const errors = validationResult(req);

    const unvalaibleProducts = []

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

    const { products } = req.body;

    try {

        const productsVerified = await Promise.all(products.map(async (product) => {
            const productVerified = await db.product.findUnique({
                where: { id: product.product.id }
            });
            if (!productVerified) {
                throw new Error(`Product with id ${product.product.id} does not exist`);
            }
            return {
                product: productVerified,
                orderQuantity: product.orderQuantity
            };
        }));
    
        const basketTotal = productsVerified.reduce(
            (total, item) => total + item.product.price * item.orderQuantity,
            0
          );

        const basket = await db.cart.findUnique({
            where: {
                id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        if (!(req.user.id === basket.user_id)) {
            return res.status(401).json({ status: 401, message: "Vous ne pouvez pas intéragir avec ce panier." });
        }

        const basketUpdated = await  db.cart.update({
            where: {
                id
            },
            data: {
                ...basket,
                total: basketTotal
            }
        })

        await db.cartHasProducts.deleteMany({
            where: {
                cart_id: basket.id
            }
        })

        productsVerified.map((product) => {
            if ((product.product.quantity - product.orderQuantity) < 0) {
                unvalaibleProducts.push(product)
            }
        })

        if (unvalaibleProducts.length) {
            return res.status(409).json({
                status: 409,
                message: "Ces produits ne sont plus disponibles",
                data: unvalaibleProducts
            })
        }

        await Promise.all(productsVerified.map(async (product) => {
            await db.product.update({
                where: {
                    id: product.product.id
                },
                data: {
                    quantity: product.product.quantity - product.orderQuantity
                }
            })

            await db.cartHasProducts.create({
                data: {
                    cart_id: basket.id,
                    product_id: product.product.id,
                    quantity: product.orderQuantity,
                    unit_price: product.product.price.toString()
                }
            });
        }));

        return res.status(200).json({
            status: 200,
            data: basketUpdated
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.post('/basket/:id/order', shouldBeAuthenticate, async (req, res) => {
    const id = req.params.id
    const user = req.user
    try {
        const basket = await db.cart.findUnique({
            where: {
                id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        if (!(req.user.id === basket.user_id)) {
            return res.status(401).json({ status: 401, message: "Vous ne pouvez pas intéragir avec ce panier." });
        }

        const productsOrdered = await db.cartHasProducts.findMany({
            where: {
                cart_id: basket.id
            },
            include: {
                product: true
            }
        })

        const order = await db.order.create({
            data: {
                user_id: user.id,
                total_amount: basket.total
            }
        })

        await Promise.all(productsOrdered.map(async (cartProduct) => {
            await db.orderDetail.create({
                data: {
                    quantity: cartProduct.quantity,
                    product_name: cartProduct.product.name,
                    product_description: cartProduct.product.description,
                    unit_price: parseInt(cartProduct.unit_price),
                    order_id: order.id
                }
            });
        }));


        return res.status(200).json({
            status: 200,
            message: "Commande crée avec succès"
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

router.delete("/basket/:id/empty", shouldBeAuthenticate, async (req, res) => {
    const id = req.params.id

    try {
        const basket = await db.cart.findUnique({
            where: {
                id,
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        if (!(req.user.id === basket.user_id)) {
            return res.status(401).json({ status: 401, message: "Vous ne pouvez pas intéragir avec ce panier." });
        }

        await db.cartHasProducts.deleteMany({
            where: {
                cart_id: basket.id
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Panier vidé avec succès"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;