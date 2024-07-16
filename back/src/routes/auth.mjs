import express from "express";
import { resetPasswordValidator, verifyValidator, changePasswordValidator, confirmAccountValidator } from "../validator/userValidator.mjs";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import moment from 'moment';
import {  sendNotificationEmail, sendPasswordResetEmail } from "../utils/mailer.mjs";
import {  generateSessionToken, verifyUserToken } from "../utils/jwt.mjs";
import { hasAuthenticate } from "../middlewares/authentication.mjs";


const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = length;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post("/verify", confirmAccountValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).send({
            status: 401,
            message: errors.formatWith(({ msg, path }) => {
                return {
                    msg,
                    path
                }
            }).array()
        });
    }

    const { token } = req.body;

    try {
        await verifyUserToken(token, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ status: 401, message: 'Token invalide ou expiré.' });
            } else {
                if (decodedToken.type === 'confirmation') {
                    const userId = decodedToken.userId;

                    const user = await db.user.findUnique({
                        where: {
                            id: userId,
                        }
                    })

                    if (user !== undefined) {
                        if (!user.has_confirmed_account) {
                            await db.user.update({
                                where: {
                                    id: userId,
                                },
                                data: {
                                    has_confirmed_account: true,
                                }
                            });

                            res.status(200).json({ status: 200, message: 'Compte confirmé avec succès.' });
                        } else {
                            res.status(400).json({ status: 400, message: 'Le compte a déjà été confirmé' });
                        }
                    } else {
                        res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
                    }
                } else {
                    res.status(401).json({ message: 'Token invalide pour la confirmation de compte.' });
                }
            }
        });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

router.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({ status: 401, message: "Email ou mot de passe invalide" });
    }

    if (!user.has_confirmed_account) {
        return res.status(401).json({ status: 401, message: "L'utilisateur n'a pas validé son compte" });
    }

    if (user.blocked_until !== null && user.blocked_until > Date.now()) {
        return res.status(403).json({ status: 403, message: 'Trop de tentatives de connexion. Votre compte est temporairement bloqué.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        if (user.number_connexion_attempts >= 3) {
            await db.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    blocked_until: new Date(Date.now() + 15 * 60 * 1000),
                    number_connexion_attempts: 0,
                }
            })

            await sendNotificationEmail(user.email);

            return res.status(403).json({ status: 403, message: 'Trop de tentatives de connexion. Votre compte est temporairement bloqué.' });
        }

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                number_connexion_attempts: user.number_connexion_attempts + 1
            }
        })

        return res.status(401).json({ status: 401, message: "Email ou mot de passe invalide" });
    }

    const token = generateSessionToken(user.id, user.role);

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            number_connexion_attempts: 0
        }
    })

    return res.status(200).json({ status: 200, data: token });
});

router.post("/reset/password", resetPasswordValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).send({
            status: 401,
            message: errors.formatWith(({ msg, path }) => {
                return {
                    msg,
                    path
                }
            }).array()
        });
    }

    const { email } = req.body;
    try {

        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return res.status(200).json({ status: 200, message: "Ok" });
        }

        const code = generateRandomCode(6)
        await sendPasswordResetEmail(existingUser.email, code)
        await db.passwordRecovery.upsert({
            where: {
                user_id: existingUser.id,
            },
            create: {
                verification_code: code,
                code_validation_time: moment().utc().add(5, 'm').toDate(),
                user_id: existingUser.id,
                last_request: moment().utc()
            },
            update: {
                verification_code: code,
                code_validation_time: moment().utc().add(5, 'm').toDate(),
                last_request: moment().utc()
            }
        })

        return res.status(200).json({ status: 200, message: "Ok" });

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

router.post("/verify/code", verifyValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).send({
            status: 401,
            message: errors.formatWith(({ msg, path }) => {
                return {
                    msg,
                    path
                }
            }).array()
        });
    }

    const { code, email } = req.body;

    try {
        const user = await db.user.findFirst({
            where: {
                email,
            }
        })

        if (!user) {
            return res.status(401).send({
                status: 401,
                message: "Une erreur est survenue",
            });
        }

        const passwordRecovery = await db.passwordRecovery.findUnique({
            where: {
                user_id: user.id
            }
        })

        if (!passwordRecovery) {
            return res.status(401).send({
                status: 401,
                message: "Le code a expiré",
            });
        }

        if (passwordRecovery.verification_code !== code) {
            return res.status(401).send({
                status: 401,
                message: "Le code a expiré",
            });
        }

        if (passwordRecovery.code_validation_time !== null && moment().utc().isAfter(moment.utc(passwordRecovery.code_validation_time))) {
            return res.status(401).send({
                status: 401,
                message: "Le code a expiré",
            });
        }

        return res.status(200).json({ status: 200, message: "Ok" });

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
})

router.put("/change/password", hasAuthenticate, changePasswordValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).send({
            status: 401,
            message: errors.formatWith(({ msg, path }) => {
                return {
                    msg,
                    path
                }
            }).array()
        });
    }

    const { password, email, oldPassword, confirmPassword } = req.body;

    try {
        if(req.user !== undefined && req.user !== null) {
            const user = req.user;

            const validPassword = await bcrypt.compare(oldPassword, user.password);

            if (!validPassword) {
                return res.status(401).json({ status: 401, message: "Le mot de passe rentré ne correspond pas à l'ancien" });
            }

            if (password !== confirmPassword) {
                return res.status(401).json({ status: 401, message: "Les mots de passe ne correspondent pas" });
            }

            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password,
                    last_updated_password: new Date(),
                }
            });
        } else {
            const user = await db.user.findUnique({
                where: {
                    email,
                }
            })
    
            if (!user) {
                return res.status(400).json({ status: 400, message: "L'utilisateur est inexistant" });
            }
    
            const passwordRecovery = await db.passwordRecovery.findUnique({
                where: {
                    user_id: user.id,
                }
            })
    
            if (!passwordRecovery) {
                return res.status(401).send({
                    status: 401,
                    message: "Le code a expiré",
                });
            }
    
            if (passwordRecovery.verification_code !== code) {
                return res.status(401).send({
                    status: 401,
                    message: "Le code a expiré",
                });
            }
    
            if (passwordRecovery.code_validation_time !== null && moment().utc().isAfter(moment.utc(passwordRecovery.code_validation_time))) {
                return res.status(401).send({
                    status: 401,
                    message: "Le code a expiré",
                });
            }
    
            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password,
                    last_updated_password: new Date(),
                }
            });
        }

        return res.status(200).json({ status: 200, message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;
