import jwt from "jsonwebtoken"
import { db } from "../utils/db.server.mjs";

export const shouldBeAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            status: 401,
            message: "Veuillez vous connecter pour avoir accès."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).send({
                status: 401,
                message: "Le token est invalide."
            });
        }

        const sessionUser = await db.user.findUnique({
            where: {
                id: user.userId,
            }
        })

        if(!sessionUser) {
            return res.status(401).send({
                status: 401,
            });
        }

        req.user = sessionUser;
        
        next();
    });
}

export const shouldBeAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            status: 401,
            message: "Veuillez vous connecter pour avoir accès."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).send({
                status: 403,
                message: "Le token est invalide."
            });
        }
        const sessionUser = await db.user.findUnique({
            where: {
                id: user.userId,
            }
        })
        if(sessionUser.role !== "ROLE_ADMIN") {
            return res.status(401).send({
                status: 401,
                message: "Vous n'avez pas accès à cette route"
            });
        }

        req.user = sessionUser;

        next();
    });
}