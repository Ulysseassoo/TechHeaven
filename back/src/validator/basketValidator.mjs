import { body } from "express-validator";

export const basketValidator = [
    body('product_id').isString(),
    body('action').isString()
];
