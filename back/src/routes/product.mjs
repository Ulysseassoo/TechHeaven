import express from "express";
import { validationResult } from "express-validator";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";
import { createData, deleteData, getIdMapping, updateData } from "../utils/sync.mjs";
import { productValidator } from "../validator/productValidator.mjs";
import { mongoDb } from "../utils/db.server.mjs";

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

const router = express.Router();

// Créer un nouveau produit
router.post("/products", shouldBeAdmin, productValidator, async (req, res) => {
    try {
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

        const { name, description, price, stock_quantity, brand } = req.body;

        const product = await createData({
            model: "product",
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
        const products = await mongoDb.product.findMany();

        return res.status(200).json({ status: 200, data: products });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération des produits", error: error.message });
    }
});

// Récupérer un produit par son ID
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { mongoId } = await getIdMapping(id)

        const product = await mongoDb.product.findUnique({
            where: {
                id: mongoId
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
router.put("/products/:id", shouldBeAdmin, productValidator, async (req, res) => {
    const { id } = req.params;

    const { name, description, price, brand, stock_quantity, lowStockAlert } = req.body;

    try {
        const { mongoId } = await getIdMapping(id)

        const product = await mongoDb.product.findUnique({
            where: {
                id: mongoId
            }
        })

        if (!product) {
            return res.status(400).json({ status: 400, message: 'Produit inexistant.' });
        }

        const updatedProduct = await updateData({
            model: "product",
            where: {
                id: mongoId
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

// // Supprimer un produit
router.delete("/products/:id", shouldBeAdmin, async (req, res) => {
    const { id } = req.params;

    try {

        const { mongoId } = await getIdMapping(id)

        await deleteData({
            model: "product",
            where: {
                id: mongoId
            }
        });

        return res.status(200).json({ status: 200, message: "Produit supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la suppression du produit", error: error.message });
    }
});

export default router;