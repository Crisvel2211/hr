import { generateServiceToken } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/sessionToken", isAuthenticated, async (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  } else {
    return res.status(401).json({ message: "User not authenticated" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const serviceToken = generateServiceToken();

    const response = await axios.get(
      `
        ${process.env.API_GATEWAY_URL}/admin/get-accounts`,
      {
        headers: { Authorization: `Bearer ${serviceToken}` },
      }
    );

    const users = response.data;
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, firstName: user.firstName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ accessToken: token });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;