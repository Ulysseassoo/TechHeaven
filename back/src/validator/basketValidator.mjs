import { body } from "express-validator";

export const basketValidator = [
    body('products').isArray(),
];
