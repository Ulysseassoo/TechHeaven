import jwt from "jsonwebtoken";

export const generateConfirmationToken = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, type: "confirmation" }, JWT_SECRET, { expiresIn: '1d' });
    return token;
}

export const generateSessionToken = (userId, role) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, type: "session", role }, JWT_SECRET, { expiresIn: '1d' });
    return token;
}

export const verifyUserToken = async (token, callback) => {
    return jwt.verify(token, process.env.JWT_SECRET, callback)
}