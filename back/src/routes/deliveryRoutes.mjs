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


// Mettre à jour le statut de livraison
router.patch('/deliveries/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['address', 'status', 'following_number', 'delivered'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).send();
        }

        updates.forEach(update => delivery[update] = req.body[update]);

        // Si la livraison est marquée comme livrée, changer le statut à "Livré"
        if (delivery.delivered) {
            delivery.status = "Livré";
        }

        await delivery.save();
        res.send(delivery);
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
