import { body } from "express-validator";

export const authValidator = [
    body("email").isEmail(),
    body("firstname").isLength({ min: 2 }),
    body("lastname").isLength({ min: 2 }),
    body("password")
        .isLength({ min: 12 })
        .withMessage('Le mot de passe doit contenir au moins 12 caractères.')
        .matches(/[a-z]/)
        .withMessage('Le mot de passe doit contenir au moins une lettre minuscule.')
        .matches(/[A-Z]/)
        .withMessage('Le mot de passe doit contenir au moins une lettre majuscule.')
        .matches(/\d/)
        .withMessage('Le mot de passe doit contenir au moins un chiffre.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Le mot de passe doit contenir au moins un symbole.')
];

export const verifyValidator = [
    body("token").isJWT()
]
