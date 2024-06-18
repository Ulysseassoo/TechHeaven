// // Importations nécessaires
// import express from 'express';
// import { validationResult } from 'express-validator';
// import { db } from '../utils/db.server.mjs';
// import { shouldBeAdmin } from '../middlewares/authentication.mjs';
// import Cart from '../models/Cart.mjs';
// import { cartValidator } from '../validator/cartValidator.mjs';

// const router = express.Router();

// // Créer un nouveau panier
// router.post("/carts", cartValidator, async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(401).send({
//                 status: 401,
//                 message: errors.formatWith(({ msg, path }) => ({ msg, path })).array()
//             });
//         }

//         const { status, user_id } = req.body;

//         const cart = await db.cart.create({
//             data: {
//                 created_at: new Date(),
//                 status,
//                 user_id
//             }
//         });

//         return res.status(201).json({ status: 201, data: cart });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// // Récupérer tous les paniers
// router.get("/carts", async (req, res) => {
//     try {
//         const carts = await db.cart.findMany();
//         return res.status(200).json({ status: 200, data: carts });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// // Récupérer un panier spécifique par son ID
// router.get("/carts/:id", async (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     try {
//         const cart = await db.cart.findUnique({
//             where: { id }
//         });

//         if (!cart) {
//             return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
//         }

//         return res.status(200).json({ status: 200, data: cart });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// // Mettre à jour un panier spécifique par son ID
// router.put("/carts/:id", cartValidator, async (req, res) => {
//     const id = parseInt(req.params.id, 10);

//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(401).send({
//                 status: 401,
//                 message: errors.formatWith(({ msg, path }) => ({ msg, path })).array()
//             });
//         }

//         const { status, user_id } = req.body;

//         const cart = await db.cart.update({
//             where: { id },
//             data: { status, user_id }
//         });

//         return res.status(200).json({ status: 200, data: cart });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// // Supprimer un panier spécifique par son ID
// router.delete("/carts/:id", async (req, res) => {
//     const id = parseInt(req.params.id, 10);

//     try {
//         await db.cart.delete({
//             where: { id }
//         });

//         return res.status(200).json({ status: 200, message: 'Panier supprimé avec succès.' });
//     } catch (error) {
//         return res.status(401).send({
//             status: 401,
//             message: error.message || error,
//         });
//     }
// });

// export default router;
