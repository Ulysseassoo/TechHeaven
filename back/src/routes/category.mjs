import express from "express";
import { validationResult } from "express-validator";
// import { db } from "../utils/db.server.mjs";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";
import { createData, deleteData, updateData } from "../utils/sync.mjs";
import { mongoDb } from "../utils/db.server.mjs";


const router = express.Router();

// Créer une nouvelle catégorie
router.post("/categories", shouldBeAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        const category = await createData({
            data: {
                name
            }
        });

        return res.status(201).json({ status: 201, data: category });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la création de la catégorie", error: error.message });
    }
});

// // Récupérer toutes les catégories
router.get("/categories", async (req, res) => {
    try {
        const categories = await mongoDb.category.findMany();

        return res.status(200).json({ status: 200, data: categories });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération des catégories", error: error.message });
    }
});

// // Récupérer une catégorie par son ID
router.get("/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { mongoId } = await getIdMapping(id)

        const category = await mongoDb.category.findUnique({
            where: {
                id: mongoId
            }
        });

        if (!category) {
            return res.status(404).json({ status: 404, message: "Catégorie non trouvée" });
        }

        return res.status(200).json({ status: 200, data: category });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la récupération de la catégorie", error: error.message });
    }
});

// // Mettre à jour une catégorie
router.put("/categories/:id", shouldBeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const { mongoId } = await getIdMapping(id)

        const updatedCategory = await updateData({
            where: {
                id: mongoId
            },
            data: {
                name
            }
        });

        return res.status(200).json({ status: 200, data: updatedCategory });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la mise à jour de la catégorie", error: error.message });
    }
});

// // Supprimer une catégorie
router.delete("/categories/:id", shouldBeAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { mongoId } = await getIdMapping(id)


        await deleteData({
            where: {
                id: mongoId
            }
        });

        return res.status(200).json({ status: 200, message: "Catégorie supprimée avec succès" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de la suppression de la catégorie", error: error.message });
    }
});

export default router;