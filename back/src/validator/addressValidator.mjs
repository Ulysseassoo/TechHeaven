import { body } from "express-validator";

export const addressValidator = [
    body('city').isString().trim().notEmpty().withMessage('City is required'),
    body('country').isString().trim().notEmpty().withMessage('Country is required'),
    body('postal_code').isString().trim().notEmpty().withMessage('Postal code is required'),
    body('address').isString().trim().notEmpty().withMessage('Address is required'),
    body('is_selected').optional().trim().notEmpty().withMessage('Is selected is required').isBoolean().withMessage('Is selected must be a boolean'),
    body('other').isString().optional().trim(),
];