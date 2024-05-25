import { body } from "express-validator";

export const productValidator = [
    body('name').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('price').isFloat(),
    body('stock_quantity').isFloat(),
    body('brand').isString().notEmpty(),
];