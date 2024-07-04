import express from 'express';
import Order from '../models/Order.mjs';
import { shouldBeAdmin } from '../middlewares/authentication.mjs';

const router = express.Router();

// ------------------------------- ROUTES -------------------------------

// // Créer une nouvelle commande
// router.post("/orders", orderValidator, async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(401).send({
//                 status: 401,
//                 message: errors.formatWith(({ msg, path }) => ({ msg, path })).array()
//             });
//         }

//         const { date, status, total_amount, user_id } = req.body;

//         const order = await db.order.create({
//             data: {
//                 date,
//                 status,
//                 total_amount,
//                 user_id
//             }
//         });

//         return res.status(201).json({ status: 201, data: order });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

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
