import { body } from "express-validator";

export const promotionValidator = [
    body('is_one_time').isBoolean(),
    body('expiry_date').isISO8601().withMessage("La date d'expiration doit être sous format ISO 8601"),
    body('type').isString(),
];