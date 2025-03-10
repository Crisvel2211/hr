import express from 'express';
import { createApplication, updateApplication, getAllApplications, 
    getApplicationById, 
    deleteApplication } from '../controllers/applicationController.js';
import upload from "../middleware/upload.js"; 

const router = express.Router();

router.post("/", upload.single("resume"), createApplication); // Handle file upload on create
router.put("/:id", upload.single("resume"), updateApplication); // Handle file upload on update
router.get("/", getAllApplications); // Get All Applications
router.get("/:id", getApplicationById); // Get One Application
router.delete("/:id", deleteApplication); // Delete Application

export default router;
