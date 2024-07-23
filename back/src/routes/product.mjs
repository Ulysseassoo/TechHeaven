import express from "express";
import { validationResult } from "express-validator";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";
import { productValidator } from "../validator/productValidator.mjs";
import { db } from "../utils/db.server.mjs";
import Product from "../models/Product.mjs";

// // Middleware pour vérifier et mettre à jour l'alerte de fin de stock
// const checkLowStockAlert = async (productId) => {
//     const product = await db.product.findUnique({
//         where: {
//             id: productId
//         }
//     });

//     const lowStockThreshold = 25; // Seuil de stock bas

//     if (product && product.stock_quantity <= lowStockThreshold) {
//         // Mettre à jour le champ lowStockAlert
//         await db.product.update({
//             where: {
//                 id: productId
//             },
//             data: {
//                 lowStockAlert: true
//             }
//         });
//     }
// };

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

        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                brand,
                stock_quantity,
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
        const products = await Product.findToClient({});

        return res.status(200).json({ status: 200, data: products });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération des produits", error: error.message });
    }
});

// Récupérer un produit par son ID
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id
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
router.put('/products/:id', shouldBeAdmin, async (req, res) => {
    try {
      const product = await db.product.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.status(200).json({ status: 200, data: product });
    } catch (error) {
      res.status(400).json({ status: 400, error: error.message });
    }
});

// // Route pour mettre à jour la quantité en stock d'un produit
// router.put("/products/:id/stock", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { quantity } = req.body;

//         // Mettre à jour la quantité en stock
//         await postgresqlDb.product.update({
//             where: {
//                 id: parseInt(id)
//             },
//             data: {
//                 stock_quantity: quantity
//             }
//         });

//         // Vérifier et mettre à jour l'alerte de fin de stock
//         await checkLowStockAlert(parseInt(id));

//         return res.status(200).json({ status: 200, message: "Quantité en stock mise à jour avec succès" });
//     } catch (error) {
//         return res.status(500).json({ status: 500, message: "Erreur lors de la mise à jour de la quantité en stock", error: error.message });
//     }
// });

// Supprimer un produit
router.delete('/products/:id', shouldBeAdmin, async (req, res) => {
  try {
    await db.product.delete({ where: { id: req.params.id } });
    res.status(200).json({ status: 200, message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ status: 400, error: error.message });
  }
});

export default router;