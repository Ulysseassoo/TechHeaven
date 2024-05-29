import express from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";


const router = express.Router();

// Fonction pour annuler automatiquement les réservations en attente depuis plus de 15 minutes
async function annulerReservations() {
    try {
        // Récupérer toutes les réservations en attente depuis plus de 15 minutes
        const reservations = await db.reservation.findMany({
            where: {
                createdAt: { lte: new Date(Date.now() - 15 * 60 * 1000) } // Rechercher les réservations créées il y a plus de 15 minutes
            }
        });

        // Parcourir les réservations trouvées et les annuler
        for (const reservation of reservations) {
            await db.reservation.update({
                where: { id: reservation.id },
                data: { status: "annulée" } // Mettre à jour le statut de la réservation à "annulée"
            });
        }

        console.log(`${reservations.length} réservations ont été automatiquement annulées.`);
    } catch (error) {
        console.error("Erreur lors de l'annulation automatique des réservations :", error);
    }
}

// Exécuter la fonction d'annulation automatique des réservations à intervalles réguliers
setInterval(annulerReservations, 15 * 60 * 1000); // Exécuter toutes les 15 minutes (en millisecondes)


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