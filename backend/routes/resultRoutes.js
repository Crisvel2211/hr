import express from "express";
import {
  submitQuizResult,
  getAllResults,
  getResultById,
  getResultsByUserId,
  getResultsByQuizId,
  getAllUserQuizPerformances,
  updateResult,
  deleteResult
} from "../controllers/ResultController.js";

const router = express.Router();

// ✅ Submit a quiz result
router.post("/submit", submitQuizResult);

// ✅ Get all quiz results
router.get("/", getAllResults);

// ✅ Get a single quiz result by ID
router.get("/:id", getResultById);

// ✅ Update a quiz result
router.put("/:id", updateResult);

// ✅ Delete a quiz result
router.delete("/:id", deleteResult);

router.get("/user/:userId", getResultsByUserId);
router.get("/quiz/:quizId", getResultsByQuizId);
router.get("/performance/all", getAllUserQuizPerformances);

export default router;
