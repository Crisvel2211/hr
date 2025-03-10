import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Securely store hashed password
    role: { type: String, default: "Applicant" }, // Default role is "Applicant"
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
