import { body } from "express-validator";

export const createAlertValidator = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('type').isString().trim().notEmpty().withMessage('Type is required'),
];