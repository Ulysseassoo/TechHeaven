import express from "express";
import { authValidator, resetPasswordValidator, userValidator, verifyValidator, changePasswordValidator, confirmAccountValidator } from "../validator/userValidator.mjs";
import bcrypt from "bcryptjs";
import moment from 'moment';
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { sendConfirmationEmail, sendNotificationEmail, sendPasswordResetEmail } from "../utils/mailer.mjs";
import { generateConfirmationToken, generateSessionToken, verifyUserToken } from "../utils/jwt.mjs";
import { shouldBeAdmin, shouldBeAuthenticate } from "../middlewares/authentication.mjs";
import { createData, getIdMapping, updateData, upsertData } from "../utils/sync.mjs";
import { anonymizeUserData } from "../utils/anonym.mjs";
import User from "../models/User.mjs";
import { getNewUsersOverTime, getTotalUsers } from "../utils/stats.mjs";

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

router.get("/users/me", shouldBeAuthenticate, async (req, res) => {
    try {
        const { _id } = await getIdMapping(req.user.id);

        const user = await User.findOne({
            _id,
        }).select("-password");

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        return res.status(200).json({
            status: 200,
            data: user.toClient()
        });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

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

        const existingUser = await db.user.findUnique({
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
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
});

router.get("/users", shouldBeAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search !== undefined && search !== "") {
            const searchQuery = new RegExp(search, 'i');
            query.$or = [
                { email: { $regex: searchQuery } },
                { firstname: { $regex: searchQuery } },
                { lastname: { $regex: searchQuery } }
            ]
        }

        const users = await User.findToClient(query, page, limit);

        const count = await User.countDocuments(query);

        return res.status(200).json({
            status: 200,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count,
            data: users
        })

    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get("/users/stats", shouldBeAdmin, async (req, res) => {
    try {
        const totalUsers = await getTotalUsers();
        const newUsers = await getNewUsersOverTime();

        return res.status(200).json({
            status: 200,
            data: {
                totalUsers,
                newUsers
            }
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get("/users/:id", shouldBeAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const { _id } = await getIdMapping(id)

        const user = await User.findOne({
            _id,
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        return res.status(200).json({
            status: 200,
            data: user.toClient()
        })
    } catch (error) {
        console.log("🚀 ~ router.get ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error.message || error,
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
        const { postgresId } = await getIdMapping(id)

        const user = await db.user.findUnique({
            where: {
                id: postgresId
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        const updatedUser = await updateData({
            model: "user",
            where: {
                id: postgresId
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
            message: error.message || error,
        });
    }
})

router.delete("/users/:id", shouldBeAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const { postgresId } = await getIdMapping(id)

        const user = await db.user.findUnique({
            where: {
                id: postgresId,
            }
        })

        if (!user) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        if (user.deleted_at !== null) {
            return res.status(400).json({ status: 400, message: 'Utilisateur inexistant.' });
        }

        await updateData({
            model: "user",
            where: {
                id: postgresId
            },
            data: anonymizeUserData()
        })

        return res.status(200).json({
            status: 200,
            message: "Compte supprimé avec succès"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

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

                    const { postgresId } = await getIdMapping(userId)


                    const user = await db.user.findUnique({
                        where: {
                            id: postgresId,
                        }
                    })

                    if (user !== undefined) {
                        if (!user.has_confirmed_account) {
                            await updateData({
                                model: "user",
                                where: {
                                    id: postgresId
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
            await updateData({
                model: "user",
                where: {
                    id: user.id,
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
                id: user.id,
            },
            data: {
                number_connexion_attempts: user.number_connexion_attempts + 1
            }
        })
        return res.status(401).json({ status: 401, message: "Email ou mot de passe invalide" });
    }

    const token = generateSessionToken(user.postgresId, user.role);

    await updateData({
        model: "user",
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
        await upsertData({
            model: "passwordRecovery",
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

router.post("/change/password", changePasswordValidator, async (req, res) => {
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

    const { password, email } = req.body;

    try {
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

        const salt = bcrypt.genSaltSync(10);
        const passwordEncrypted = bcrypt.hashSync(password, salt);

        await updateData({
            model: "user",
            where: {
                id: user.id
            },
            data: {
                password: passwordEncrypted,
                last_updated_password: new Date(),
            },
        });

        return res.status(200).json({ status: 200, message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;