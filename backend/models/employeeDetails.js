  import mongoose from "mongoose";

  // Employee Details Schema
  const EmployeeDetailsSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
      fullname: { type: String, required: true },
      email: { type: String}, // Added email field
      address: { type: String },
      birthdate: { type: Date },
      gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
      nationality: { type: String, required: true, default: "Filipino" },
      civilStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], required: true },
      education: { type: String },
      experience: { type: String },
      skills: { type: [String] },
      resume: { type: String },
      linkedin: { type: String },

      // Fixed department field definition
      department: {
        type: String,
        enum: ["Admin", "Logistic1", "Logistic2", "Hr1", "Hr2", "Hr3", "Hr4", "Core1", "Core2", "Finance"],
        default: "Logistic2",
      },

      // Fixed role field definition
      role: { type: String, default: "Employee" },
    },
    { timestamps: true }
  );

  const EmployeeDetails = mongoose.model("EmployeeDetails", EmployeeDetailsSchema);
  export default EmployeeDetails;
