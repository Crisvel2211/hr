import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateServiceToken = (req, res) => {
    try {
        const payload = { service: "Hr 2" };
        const token = jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: "10m" });

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Failed to generate token", error });
    }
};
