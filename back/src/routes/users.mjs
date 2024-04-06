import express from "express";
import { authValidator, verifyValidator } from "../validator/userValidator.mjs";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { sendConfirmationEmail } from "../utils/mailer.mjs";
import { generateConfirmationToken, generateSessionToken, verifyUserToken } from "../utils/jwt.mjs";

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

        const user = await db.user.create({
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
                created_at: true,
                id: true
            }
        });

        const confirmationToken = generateConfirmationToken(user.id)
        await sendConfirmationEmail(email, confirmationToken);

        return res.json({ status: 201, data: user });
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error,
        });
    }
});

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
              res.status(401).json({ message: 'Token invalide ou expiré.' });
            } else {
              if (decodedToken.type === 'confirmation') {
                const userId = decodedToken.userId;
        
                const user = await db.user.findUnique({
                    where: {
                        id: userId,
                    }
                })
                
                if(user !== undefined) {
                    await db.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            has_confirmed_account: true,
                        }
                    })
    
                    res.status(200).json({ status: 200, message: 'Compte confirmé avec succès.' });
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
            message: error,
        });
    }
})

router.post("/auth", async (req, res) => {
	const { email, password } = req.body;
	const user = await db.user.findUnique({ where: { email } });

	if (!user) {
		return res.status(401).json({ status: 401, message: "Email ou mot de passe invalide" });
	}

    if(!user.has_confirmed_account) {
		return res.status(401).json({ status: 401, message: "L'utilisateur n'a pas validé son compte" });
    }

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
		return res.status(401).json({ status: 401, message: "Email ou mot de passe invalide" });
	}

	const token = generateSessionToken(user.id);

	return res.status(200).json({ status: 200, data: token });
});

export default router;