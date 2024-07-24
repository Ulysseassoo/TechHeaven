import express from 'express';
import Order from '../models/Order.mjs';
import { db } from "../utils/db.server.mjs";
import { shouldBeAdmin, shouldBeAuthenticate } from '../middlewares/authentication.mjs';

const router = express.Router();

router.post('/orders', shouldBeAuthenticate, async (req, res) => {
    const user = req.user
    try {
        const basket = await db.cart.findFirst({
            where: {
                user_id: user.id
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
                    order_id: order.id,
                    product_id: cartProduct.product.id
                }
            });
        }));


        return res.status(200).json({
            status: 200,
            data: order
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

router.get("/orders", shouldBeAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, search, st, paymentStatus } = req.query;
        const query = {};

        if (search !== undefined && search !== "") {
            const searchQuery = new RegExp(search, 'i');
            query.$or = [
                { 'user.firstname': { $regex: searchQuery } },
                { 'user.lastname': { $regex: searchQuery } }
            ]
        }

        if (st !== undefined && st !== "") {
            query.status = st;
        }

        if (paymentStatus !== undefined && paymentStatus !== "") {
            query.paymentStatus = paymentStatus;
        }

        const orders = await Order.findToClient(query, page, limit);

        const count = await Order.countDocuments(query);

        return res.status(200).json({
            status: 200,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalCount: count,
            data: orders
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
});

// // Récupérer une commande spécifique par son ID
// router.get("/orders/:id", async (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     try {
//         const order = await db.order.findUnique({
//             where: { id }
//         });

//         if (!order) {
//             return res.status(400).json({ status: 400, message: 'Commande inexistante.' });
//         }

//         return res.status(200).json({ status: 200, data: order });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// // Mettre à jour une commande spécifique par son ID
// router.put("/orders/:id", orderValidator, async (req, res) => {
//     const id = parseInt(req.params.id, 10);

//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(401).send({
//                 status: 401,
//                 message: errors.formatWith(({ msg, path }) => ({ msg, path })).array()
//             });
//         }

//         const { date, status, total_amount, user_id } = req.body;

//         const order = await db.order.update({
//             where: { id },
//             data: { date, status, total_amount, user_id }
//         });

//         return res.status(200).json({ status: 200, data: order });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// // Supprimer une commande spécifique par son ID
// router.delete("/orders/:id", async (req, res) => {
//     const id = parseInt(req.params.id, 10);

//     try {
//         await db.order.delete({
//             where: { id }
//         });

//         return res.status(200).json({ status: 200, message: 'Commande supprimée avec succès.' });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

export default router;
