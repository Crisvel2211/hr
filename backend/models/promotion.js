import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee",  // ✅ Connects to Employee Model
      required: true 
    },
    currentRole: { type: String, required: true },
    newRole: { type: String, required: true },
    promotionStatus: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"],  // ✅ Enum for promotion states
      default: "Pending"
    },
    remarks: { type: String, default: "" }
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt automatically
);

export default mongoose.model("Promotion", PromotionSchema);
