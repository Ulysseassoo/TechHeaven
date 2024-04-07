import jwt from "jsonwebtoken";

export const generateConfirmationToken = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, type: "confirmation" }, JWT_SECRET, { expiresIn: '1d' });
    return token;
}

export const generateSessionToken = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, type: "session" }, JWT_SECRET, { expiresIn: '7d' });
    return token;
}

export const generatePasswordResetToken = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, type: "reset" }, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

export const verifyUserToken = async (token, callback) => {
    return jwt.verify(token, process.env.JWT_SECRET, callback)
}