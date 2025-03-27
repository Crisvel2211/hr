import EmployeeDetails from "../models/employeeDetails.js";
import fs from "fs"; // File system module for deleting files


export const createEmployeeDetails = async (req, res) => {
  try {
    const { 
      userId, fullname, email, address, birthdate, gender, nationality, 
      civilStatus, education, experience, skills, linkedin, department, role 
    } = req.body;

    const resumePath = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    // Check if employee details already exist for this user
    const existingEmployee = await EmployeeDetails.findOne({ userId });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee details already exist for this user" });
    }

    // Create new employee details with default values if missing
    const employeeDetails = new EmployeeDetails({
      userId,
      fullname,
      email,
      address,
      birthdate,
      gender,
      nationality,
      civilStatus,
      education,
      experience,
      skills: skills ? skills.split(",") : [], // Convert string to array
      resume: resumePath,
      linkedin,
      department: department || "Logistic2", // Default to "Logistic2"
      role: role || "Employee", // Default to "New Hired Employee"
    });

    await employeeDetails.save();
    res.status(201).json({ message: "Employee details created successfully", employeeDetails });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// 📌 Update Employee Details with Resume Upload
export const updateEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, address, birthdate, gender, nationality, civilStatus, education, experience, skills, linkedin, email,role, department } = req.body;

    // Find existing employee details
    const employeeDetails = await EmployeeDetails.findById(id);
    if (!employeeDetails) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Handle Resume Upload
    let resumePath = employeeDetails.resume; // Keep old resume if no new file
    if (req.file) {
      // Delete old resume file if exists
      if (employeeDetails.resume) {
        const oldFilePath = `./public${employeeDetails.resume}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Remove old file
        }
      }
      resumePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // Use full URL path
    }

    // Update Employee Details
    const updatedEmployee = await EmployeeDetails.findByIdAndUpdate(
      id,
      {
        fullname,
        address,
        email,
        birthdate,
        gender,
        nationality,
        civilStatus,
        education,
        experience,
        skills: skills ? skills.split(",") : [], // Convert string to array
        resume: resumePath, // Update resume if changed
        linkedin,
        department,
        role
      },
      { new: true }
    );

    res.status(200).json({ message: "Employee details updated successfully", updatedEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 📌 Get All Employee Details
export const getAllEmployeeDetails = async (req, res) => {
  try {
    const employees = await EmployeeDetails.find().populate("userId", "username email");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get Single Employee Details by ID
export const getEmployeeDetailsById = async (req, res) => {
  try {
    const employee = await EmployeeDetails.findById(req.params.id).populate("userId", "username email");
    if (!employee) return res.status(404).json({ message: "Employee details not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 📌 Delete Employee Details by ID
export const deleteEmployeeDetails = async (req, res) => {
  try {
    const deletedEmployee = await EmployeeDetails.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee details not found" });

    res.status(200).json({ message: "Employee details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeDetailsByUserId = async (req, res) => {
  try {

    const employee = await EmployeeDetails.findOne({ userId: req.params.id }).populate("userId", "username email");

    if (!employee) return res.status(404).json({ message: "Employee details not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

