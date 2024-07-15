import express from 'express';
import Delivery from "../models/Delivery.mjs";

const router = express.Router();

// Ajouter une nouvelle livraison
router.post('/deliveries', async (req, res) => {
    const delivery = new Delivery(req.body);
    try {
        await delivery.save();
        res.status(201).send(delivery);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Récupérer toutes les livraisons
router.get('/deliveries', async (req, res) => {
    try {
        const deliveries = await Delivery.find({});
        res.status(200).send(deliveries);
    } catch (e) {
        res.status(500).send();
    }
});

export default router;
