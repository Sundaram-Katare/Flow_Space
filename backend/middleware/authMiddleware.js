const { verifyToken } = require("../services/jwt");

export const verifyAuth = async (req, res, next) => {
    try {
     const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = verifyToken(token);

    req.userId = decoded.userId;

    next();
    } catch (err) {
        res.status(401).json({ error: err.message || "Invalid Token" });
    }
};