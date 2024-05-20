import express from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";


const router = express.Router();

// Créer une nouvelle réservation
router.post("/reservations", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Convertir productId en entier
        const parsedProductId = parseInt(productId);

        // Vérifier si le produit existe et si la quantité demandée est disponible
        const product = await db.product.findUnique({
            where: { id: parsedProductId }
        });

        if (!product) {
            return res.status(404).json({ status: 404, message: "Produit non trouvé" });
        }

        if (product.stock_quantity < quantity) {
            return res.status(400).json({ status: 400, message: "Quantité insuffisante en stock" });
        }

        // Créer la réservation
        const reservation = await db.reservation.create({
            data: {
                userId, 
                productId: parsedProductId,
                quantity
            }
        });

        // Mettre à jour la quantité en stock du produit
        await db.product.update({
            where: { id: parsedProductId },
            data: { stock_quantity: product.stock_quantity - quantity }
        });

        return res.status(201).json({ status: 201, data: reservation });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la création de la réservation", error: error.message });
    }
});

// Récupérer toutes les réservations
router.get("/reservations", async (req, res) => {
    try {
        const reservations = await db.reservation.findMany();

        return res.status(200).json({ status: 200, data: reservations });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération des réservations", error: error.message });
    }
});

export default router;