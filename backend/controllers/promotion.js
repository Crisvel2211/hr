import Promotion from "../models/promotion.js";
import Employee from "../models/employeeModel.js";

// 📌 Create a Promotion
export const createPromotion = async (req, res) => {
  try {
    const { userId, newRole, remarks } = req.body;

    // ✅ Fetch Employee Role from Employee Model
    const employee = await Employee.findById(userId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const newPromotion = new Promotion({
      userId,
      currentRole: employee.role, // ✅ Automatically fetch current role
      newRole,
      remarks
    });

    const savedPromotion = await newPromotion.save();

    res.status(201).json({
      success: true,
      message: "Promotion request created",
      promotion: savedPromotion
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get All Promotions
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate("userId", "username email role");
    res.status(200).json({ success: true, promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get Single Promotion by ID
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate("userId", "username email role");
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }
    res.status(200).json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update Promotion Status
export const updatePromotion = async (req, res) => {
  try {
    const { promotionStatus, remarks } = req.body;
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { promotionStatus, remarks },
      { new: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    res.status(200).json({
      success: true,
      message: "Promotion status updated",
      updatedPromotion
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete Promotion
export const deletePromotion = async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!deletedPromotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    res.status(200).json({ success: true, message: "Promotion deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
