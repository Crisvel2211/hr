import express from "express";
import {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion
} from "../controllers/promotion.js";

const router = express.Router();

// 📌 Create a new promotion request
router.post("/", createPromotion);

// 📌 Get all promotion requests
router.get("/", getPromotions);

// 📌 Get a single promotion request by ID
router.get("/:id", getPromotionById);

// 📌 Update a promotion request (status update)
router.put("/:id", updatePromotion);

// 📌 Delete a promotion request
router.delete("/:id", deletePromotion);

export default router;
