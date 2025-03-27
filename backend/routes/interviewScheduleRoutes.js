import express from "express";
import {
  scheduleInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getInterviewByUserId

} from "../controllers/interviewScheduleController.js";

const router = express.Router();

router.post("/", scheduleInterview);         // Schedule a new interview
router.get("/", getAllInterviews);           // Get all interviews
router.get("/:id", getInterviewById);        // Get interview by ID
router.put("/:id", updateInterview);         // Update interview
router.delete("/:id", deleteInterview);     // Delete interview
router.get("/user/:userId", getInterviewByUserId);

export default router;
