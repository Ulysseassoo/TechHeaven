import jwt from "jsonwebtoken"

export const shouldBeAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            status: 401,
            message: "Veuillez vous connecter pour avoir accès."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({
                status: 401,
                message: "Le token est invalide."
            });
        }
        req.user = user;
        
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

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({
                status: 403,
                message: "Le token est invalide."
            });
        }
        req.user = user;
        if(req.user.role !== "ROLE_ADMIN") {
            return res.status(401).send({
                status: 401,
                message: "Vous n'avez pas accès à cette route"
            });
        }

        next();
    });
}