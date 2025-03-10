import express from "express";
import upload from "../middleware/upload.js"; // Import multer middleware
import {
  createEmployeeDetails,
  getAllEmployeeDetails,
  getEmployeeDetailsById,
  updateEmployeeDetails,
  deleteEmployeeDetails,getEmployeeDetailsByUserId
} from "../controllers/employeeDetailsController.js";

const router = express.Router();

router.post("/", upload.single("resume"), createEmployeeDetails); // Handle file upload on create
router.put("/:id", upload.single("resume"), updateEmployeeDetails); // Handle file upload on update
router.get("/", getAllEmployeeDetails);
router.get("/user/:id", getEmployeeDetailsByUserId);
router.get("/:id", getEmployeeDetailsById);
router.delete("/:id", deleteEmployeeDetails);

export default router;
