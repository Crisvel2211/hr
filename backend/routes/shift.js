import express from "express";
import Shift from "../models/shifts.js";

const router = express.Router();

// Get all shifts
router.get("/", async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifts", error });
  }
});

// Add a new shift
router.post("/", async (req, res) => {
  const { employeeName, employeePosition, shiftType, differentialRate, salary, timeRange } = req.body;

  if (!employeeName || !employeePosition || !shiftType || differentialRate == null || salary == null || !timeRange) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newShift = await Shift.create({ employeeName, employeePosition, shiftType, differentialRate, salary, timeRange });
    res.status(201).json(newShift);
  } catch (error) {
    res.status(400).json({ message: "Error adding shift", error });
  }
});

// Update an existing shift
router.put("/:id", async (req, res) => {
  try {
    const updatedShift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedShift) return res.status(404).json({ message: "Shift not found" });

    res.json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: "Error updating shift", error });
  }
});

// Delete a shift
router.delete("/:id", async (req, res) => {
  try {
    const deletedShift = await Shift.findByIdAndDelete(req.params.id);

    if (!deletedShift) return res.status(404).json({ message: "Shift not found" });

    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting shift", error });
  }
});

export default router;
