import express from 'express';
import { db } from '../utils/db.server.mjs';
import dotenv from 'dotenv';
import Delivery from "../models/Delivery.mjs";
import { Shippo } from 'shippo';
import Joi from 'joi';

dotenv.config();

if (!process.env.SHIPPO_API_KEY) {
    throw new Error('SHIPPO_API_KEY is not defined in the environment variables');
}

const router = express.Router();
const shippo = new Shippo(process.env.SHIPPO_API_KEY);

const addressSchema = Joi.object({
    name: Joi.string().required(),
    street1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().optional(),
    email: Joi.string().optional().email()
});

const parcelSchema = Joi.object({
    length: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    distance_unit: Joi.string().valid('in', 'cm').required(),
    weight: Joi.number().required(),
    mass_unit: Joi.string().valid('lb', 'kg').required()
});

// Endpoint pour créer une étiquette d'expédition
router.post('/create-shipment', async (req, res) => {
    const { addressFrom, addressTo, parcel } = req.body;

    // Valider les données d'entrée
    const addressFromValidation = addressSchema.validate(addressFrom);
    const addressToValidation = addressSchema.validate(addressTo);
    const parcelValidation = parcelSchema.validate(parcel);

    if (addressFromValidation.error || addressToValidation.error || parcelValidation.error) {
        return res.status(400).json({
            error: 'Invalid input data',
            details: {
                addressFrom: addressFromValidation.error ? addressFromValidation.error.details : null,
                addressTo: addressToValidation.error ? addressToValidation.error.details : null,
                parcel: parcelValidation.error ? parcelValidation.error.details : null
            }
        });
    }

    try {
        // Convertir les nombres en chaînes de caractères
        const formattedParcel = {
            length: parcel.length.toString(),
            width: parcel.width.toString(),
            height: parcel.height.toString(),
            distance_unit: parcel.distance_unit,
            weight: parcel.weight.toString(),
            mass_unit: parcel.mass_unit
        };

    
        const shipment = await shippo.shipments.create({
            address_from: addressFrom,
            address_to: addressTo,
            parcels: [formattedParcel],
            async: false
        });

        console.log('Shipment:', shipment);

        if (!shipment || !shipment.rates) {
            throw new Error('Shipment creation failed or rates not found');
        }

        const rate = shipment.rates.find(rate => rate.servicelevel.token === 'ups_ground');

        if (!rate) {
            throw new Error('UPS Ground rate not found');
        }

        const transaction = await shippo.transactions.create({
            rate: rate.object_id,
            label_file_type: 'PDF'
        });

        console.log('Transaction:', transaction);

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
        console.error('Error creating shipment:', error.message);
        res.status(500).json({ error: error.message, details: error });
    }
});

// Endpoint pour suivre un colis
router.get('/track-shipment/:carrier/:trackingNumber', async (req, res) => {
    const { carrier, trackingNumber } = req.params;

    try {
        const tracking = await shippo.track.get_status(carrier, trackingNumber);
        res.status(200).json(tracking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
