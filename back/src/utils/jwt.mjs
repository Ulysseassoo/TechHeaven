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


function generateTestToken(userId) {
    const payload = {
      id: userId,
      role: 'ROLE_ADMIN', 
    };
  
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }

export { generateTestToken };