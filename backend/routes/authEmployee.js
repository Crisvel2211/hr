import express from "express";
import {
  signup,
  signin,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/authEmployee.js";

const router = express.Router();

// Employee Authentication Routes
router.post("/signup", signup);
router.post("/signin", signin);

// Employee Management Routes
router.get("/", getAllEmployees);
router.get("/:id", getEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
