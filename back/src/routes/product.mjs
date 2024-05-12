import express from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";

const router = express.Router();


// Route pour calculer le total des produits restants
router.get("/stock-total", async (req, res) => {
    try {
        const products = await db.product.findMany();
        let totalStock = 0;

        products.forEach((product) => {
            totalStock += product.stock_quantity;
        });

        return res.status(200).json({ status: 200, totalStock });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors du calcul du total du stock", error: error.message });
    }
});


// Middleware pour vérifier et mettre à jour l'alerte de fin de stock
const checkLowStockAlert = async (productId) => {
    const product = await db.product.findUnique({
        where: {
            id: productId
        }
    });

    const lowStockThreshold = 25; // Seuil de stock bas

    if (product && product.stock_quantity <= lowStockThreshold) {
        // Mettre à jour le champ lowStockAlert
        await db.product.update({
            where: {
                id: productId
            },
            data: {
                lowStockAlert: true
            }
        });
    }
};

// Route pour mettre à jour la quantité en stock d'un produit
router.put("/products/:id/stock", async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Mettre à jour la quantité en stock
        await db.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                stock_quantity: quantity
            }
        });

        // Vérifier et mettre à jour l'alerte de fin de stock
        await checkLowStockAlert(parseInt(id));

        return res.status(200).json({ status: 200, message: "Quantité en stock mise à jour avec succès" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la mise à jour de la quantité en stock", error: error.message });
    }
});

// Créer un nouveau produit
router.post("/products",  shouldBeAdmin,async (req, res) => {
    try {
        const { name, description, price, brand, stock_quantity, lowStockAlert } = req.body;

        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                brand,
                stock_quantity,
                lowStockAlert

            }
        });

        return res.status(201).json({ status: 201, data: product });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la création du produit", error: error.message });
    }
});

// Récupérer tous les produits
router.get("/products", async (req, res) => {
    try {
        const products = await db.product.findMany();

        return res.status(200).json({ status: 200, data: products });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération des produits", error: error.message });
    }
});

// Récupérer un produit par son ID
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const product = await db.product.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!product) {
            return res.status(404).json({ status: 404, message: "Produit non trouvé" });
        }

        return res.status(200).json({ status: 200, data: product });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération du produit", error: error.message });
    }
});

// Mettre à jour un produit
router.put("/products/:id", shouldBeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, brand, stock_quantity, lowStockAlert } = req.body;

        const updatedProduct = await db.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                description,
                price,
                brand,
                stock_quantity,
                lowStockAlert
            }
        });

        return res.status(200).json({ status: 200, data: updatedProduct });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la mise à jour du produit", error: error.message });
    }
});

// Supprimer un produit
router.delete("/products/:id", shouldBeAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await db.product.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({ status: 200, message: "Produit supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la suppression du produit", error: error.message });
    }
});

export default router;