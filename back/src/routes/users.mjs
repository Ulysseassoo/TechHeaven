import express from "express";
import { authValidator, resetPasswordValidator, userValidator, verifyValidator } from "../validator/userValidator.mjs";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { mongoDb, postgresqlDb } from "../utils/db.server.mjs";
import { sendConfirmationEmail, sendNotificationEmail, sendPasswordResetEmail } from "../utils/mailer.mjs";
import { generateConfirmationToken, generatePasswordResetToken, generateSessionToken, verifyUserToken } from "../utils/jwt.mjs";
import { shouldBeAdmin, shouldBeAuthenticate } from "../middlewares/authentication.mjs";
import { createData, deleteData, updateData } from "../utils/sync.mjs";

const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post("/users", authValidator, async (req, res) => {
    try {
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

        const { email, password, firstname, lastname } = req.body;

        const existingUser = await postgresqlDb.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ status: 400, message: "L'utilisateur existe déjà." });
        }

        const salt = bcrypt.genSaltSync(10);
        const passwordEncrypted = bcrypt.hashSync(password, salt);

        const user = await createData({
            model: "user",
            data: {
                email,
                firstname,
                lastname,
                password: passwordEncrypted,
                last_updated_password: new Date(),
                role: "ROLE_USER",
            },
            select: {
                email: true,
                firstname: true,
                lastname: true,
                id: true
            }
        })

        const confirmationToken = generateConfirmationToken(user.id)
        await sendConfirmationEmail(email, confirmationToken);

        return res.json({ status: 201, data: user });
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
});

router.get("/users/:id", shouldBeAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const user = await mongoDb.user.findUnique({
            where: {
                postgresId: id,
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        return res.status(200).json({
            status: 200,
            data: user
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
})

router.put("/users/:id", shouldBeAdmin, userValidator, async (req, res) => {
    const id = req.params.id

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

    const { email, firstname, lastname, phone } = req.body;

    try {
        const user = await mongoDb.user.findUnique({
            where: {
                postgresId: id,
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        const updatedUser = await updateData({
            model: "user",
            where: {
                id: user.postgresId
            },
            data: {
                email,
                firstname,
                lastname,
                phone: phone ?? null
            },
            select: {
                email: true,
                firstname: true,
                lastname: true,
                created_at: true,
                id: true,
                phone: true,
            }
        })

        return res.status(200).json({
            status: 200,
            data: updatedUser
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
})

router.delete("/users/:id", shouldBeAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const user = await mongoDb.user.findUnique({
            where: {
                postgresId: id,
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        await deleteData({
            model: "user",
            where: {
                id
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Ok"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

router.post("/verify", verifyValidator, async (req, res) => {
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

                    const user = await mongoDb.user.findUnique({
                        where: {
                            postgresId: userId,
                        }
                    })

                    if (user !== undefined) {
                        if (!user.has_confirmed_account) {
                            await updateData({
                                model: "user",
                                where: {
                                    id: userId
                                },
                                data: {
                                    has_confirmed_account: true,
                                }
                            })

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
    const user = await mongoDb.user.findUnique({ where: { email } });

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
            await updateData({
                model: "user",
                where: {
                    id: user.postgresId,
                }, 
                data: {
                    blocked_until: new Date(Date.now() + 15 * 60 * 1000),
                    number_connexion_attempts: 0,
                }
            });

            await sendNotificationEmail(user.email);

            return res.status(403).json({ status: 403, message: 'Trop de tentatives de connexion. Votre compte est temporairement bloqué.' });
        }

        await updateData({
            model: "user",
            where: {
                id: user.postgresId,
            },
            data: {
                number_connexion_attempts: user.number_connexion_attempts + 1
            }
        })
        return res.status(401).json({ status: 401, message: "Email ou mot de passe invalide" });
    }

    const token = generateSessionToken(user.postgresId, user.role);

    updateData({
        model: "user",
        where: {
            id: user.postgresId,
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

        const existingUser = await mongoDb.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return res.status(200).json({ status: 200, message: "Ok" });
        }

        const token = generatePasswordResetToken(existingUser.postgresId)
        await sendPasswordResetEmail(existingUser.email, token)
        await upsertData({
            model: "passwordRecovery",
            where: {
                user_id: existingUser.id,
            },
            create: {
                verification_code: token,
                code_validation_time: "1h",
                user_id: existingUser.id,
                last_request: new Date()
            },
            update: {
                verification_code: token,
                last_request: new Date()
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

    const { token } = req.body;
    try {
        await verifyUserToken(token, async (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'Token invalide ou expiré.' });
            } else {
                if (decodedToken.type === 'reset') {
                    const userId = decodedToken.userId;

                    const user = await mongoDb.user.findUnique({
                        where: {
                            postgresId: userId,
                        }
                    })

                    if (user !== undefined) {
                        res.status(200).json({ status: 200, message: 'Ok' });
                    } else {
                        res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
                    }
                } else {
                    res.status(401).json({ message: 'Token invalide.' });
                }
            }
        });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
})

router.post("/change/password", async (req, res) => {
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

    const { oldPassword, password, token } = req.body;

    try {
        await verifyUserToken(token, async (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'Token invalide ou expiré.' });
            } else {
                if (decodedToken.type === 'reset') {
                    const userId = decodedToken.userId;

                    const user = await mongoDb.user.findUnique({
                        where: {
                            postgresId: userId,
                        }
                    })

                    if (user !== undefined) {
                        const isMatch = await bcrypt.compare(oldPassword, user.password);

                        if (!isMatch) {
                            return res.status(400).json({ status: 400, message: 'Ancien mot de passe incorrect' });
                        }

                        const isSamePassword = await bcrypt.compare(oldPassword, password)

                        if (isSamePassword) {
                            return res.status(400).json({ status: 400, message: "Le nouveau mot de passe doit être différent de l'ancien" });
                        }

                        const salt = bcrypt.genSaltSync(10);
                        const passwordEncrypted = bcrypt.hashSync(password, salt);

                        await updateData({
                            model: "user",
                            where: {
                                id: user.postgresId
                            },
                            data: {
                                password: passwordEncrypted,
                                last_updated_password: new Date(),
                            },
                        });

                        return res.status(200).json({ status: 200, message: 'Mot de passe mis à jour avec succès.' });

                    } else {
                        return res.status(401).json({ status: 401, message: 'Token invalide.' });
                    }
                } else {
                    return res.status(401).json({ message: 'Token invalide.' });
                }
            }
        });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
})

export default router;