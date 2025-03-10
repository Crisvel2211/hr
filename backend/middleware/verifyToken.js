import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).json({ message: "Missing Token" }); // ✅ Directly return response
    }

    const token = accessToken.startsWith("Bearer ") ? accessToken.slice(7) : accessToken; 

    try {
        const verifyAccessToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifyAccessToken;
        next(); // ✅ Move to the next middleware if token is valid
    } catch (error) {
        return res.status(403).json({ message: "You are not authorized to access", error: error.message });
    }
};
