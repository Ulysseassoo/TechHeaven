import { body } from "express-validator";

export const userValidator = [
    body('firstname').isString(),
    body('lastname').isString(),
    body('email').isEmail(),
    body('phone').isString(),
];

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

export const confirmAccountValidator = [
    body("token").isJWT()

]

export const verifyValidator = [
    body("code").isString().isLength({ min: 1 }),
    body("email").isEmail()

]

export const resetPasswordValidator = [
    body("email").isEmail()
]

export const changePasswordValidator = [
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
        .withMessage('Le mot de passe doit contenir au moins un symbole.'),
    body("email").isEmail().withMessage("L'email doit être valide.")
];
