import mongoose from "mongoose";

// Employee Details Schema (Linked to EmployeeAuth)
const EmployeeDetailsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Reference to EmployeeAuth
    fullname: { type: String, required: true }, // Full Name
    address: { type: String }, // Address
    birthdate: { type: Date }, // Birthdate
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true }, // Gender
    nationality: { type: String, required: true, default: "Filipino" }, // Default to Filipino
    civilStatus: { 
      type: String, 
      enum: ["Single", "Married", "Divorced", "Widowed"], 
      required: true 
    }, // Marital Status
    education: { type: String }, // Highest Educational Attainment
    experience: { type: String }, // Work Experience
    skills: { type: [String] }, // List of skills
    resume: { type: String }, // Resume file URL
    linkedin: { type: String }, // LinkedIn profile (optional)
  },
  { timestamps: true }
);

const EmployeeDetails = mongoose.model("EmployeeDetails", EmployeeDetailsSchema);
export default EmployeeDetails;
