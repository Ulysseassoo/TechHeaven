import express from 'express';
import { db } from '../utils/db.server.mjs';
import dotenv from 'dotenv';
import Delivery from "../models/Delivery.mjs";
import { Shippo } from 'shippo';

dotenv.config();

if (!process.env.SHIPPO_API_KEY) {
    throw new Error('SHIPPO_API_KEY is not defined in the environment variables');
}

const router = express.Router();

const shippoClient = new Shippo(process.env.SHIPPO_API_KEY);
//const shippoClient = process.env.SHIPPO_API_KEY;

// Endpoint pour créer une étiquette d'expédition
router.post('/create-shipment', async (req, res) => {
    const { addressFrom, addressTo, parcel } = req.body;

    try {
        const shipment = await shippoClient.shipment.create({
            address_from: addressFrom,
            address_to: addressTo,
            parcels: [parcel],
            async: false
        });


        const rate = shipment.rates.find(rate => rate.servicelevel.token === 'ups_ground');
        
        const transaction = await shippoClient.transaction.create({
            rate: rate.object_id,
            label_file_type: 'PDF'
        });

        if (transaction.status === 'SUCCESS') {
            res.status(200).json({
                tracking_number: transaction.tracking_number,
                tracking_url: transaction.tracking_url_provider,
                label_url: transaction.label_url
            });
        } else {
            res.status(500).json({ error: transaction.messages });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint pour suivre un colis
router.get('/track-shipment/:carrier/:trackingNumber', async (req, res) => {
    const { carrier, trackingNumber } = req.params;

    try {
        const tracking = await shippoClient.track.get_status(carrier, trackingNumber);
        res.status(200).json(tracking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;