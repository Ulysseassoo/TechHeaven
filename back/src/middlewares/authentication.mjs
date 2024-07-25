import jwt from "jsonwebtoken";
import { db } from "../utils/db.server.mjs";

export const shouldBeAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "Veuillez vous connecter pour avoir accès.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).send({
        status: 401,
        message: "Le token est invalide.",
      });
    }

    const sessionUser = await db.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if (!sessionUser) {
      return res.status(401).send({
        status: 401,
      });
    }

    req.user = sessionUser;

    next();
  });
};

export const shouldBeAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "Veuillez vous connecter pour avoir accès.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide.",
      });
    }
    const sessionUser = await db.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if(!sessionUser) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide"
      });
    }

    if (sessionUser.role !== "ROLE_ADMIN") {
      return res.status(401).send({
        status: 401,
        message: "Vous n'avez pas accès à cette ressource",
      });
    }

    req.user = sessionUser;

    next();
  });
};

export const shouldBeStoreKeeper = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "Veuillez vous connecter pour avoir accès.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide.",
      });
    }
    const sessionUser = await db.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if(!sessionUser) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide"
      });
    }

    if (sessionUser.role !== "ROLE_STORE_KEEPER") {
      return res.status(401).send({
        status: 401,
        message: "Vous n'avez pas accès à cette ressource",
      });
    }

    req.user = sessionUser;

    next();
  });
};

export const shouldBeAdminOrKeeper = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "Veuillez vous connecter pour avoir accès.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide.",
      });
    }
    const sessionUser = await db.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if(!sessionUser) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide"
      });
    }

    if (!["ROLE_STORE_KEEPER", "ROLE_ADMIN"].includes(sessionUser.role)) {
      return res.status(401).send({
        status: 401,
        message: "Vous n'avez pas accès à cette ressource",
      });
    }

    req.user = sessionUser;

    next();
  });
}

export const hasAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: "Le token est invalide.",
      });
    } else {
      const sessionUser = await db.user.findUnique({
        where: {
          id: user.userId,
        },
      });

      if (sessionUser) {
        req.user = sessionUser;
      }
    }
    next();
  });
};


export const checkFields = (allowedFieldsForConnectedUser) => {
  return (req, res, next) => {
    if (req.user) {
      if (req.user.role === 'ROLE_ADMIN') {
        return next();
      } else {
        const filteredBody = {};
        Object.keys(req.body).forEach((key) => {
          if (allowedFieldsForConnectedUser.includes(key)) {
            filteredBody[key] = req.body[key];
          }
        });
        req.body = filteredBody;
        return next();
      }
    } else {
      return res.status(401).send({
        status: 401,
        message: "Vous n'avez pas accès à cette ressource",
      });
    }
  };
};
