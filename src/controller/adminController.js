import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../schema/adminSchema.js";
import bcrypt from "bcrypt";
import {
  getAdminByEmail,
  updateAdminName,
  updateAdminProfileImage,
} from "../service/adminService.js";

dotenv.config();

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      token,
      admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};


  const updateAdmin = async (req, res) => {
    try {
      const { name, phoneNumber } = req.body;
  
      const updatedAdmin = await updateAdminName(req.admin._id, { name, phoneNumber });
  
      res.status(200).json({
        success: true,
        message: "Admin profile updated",
        admin: updatedAdmin,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Update failed",
        error: err.message,
      });
    }
  };

const uploadAdminProfilePicture = async (req, res) => {
  try {
    const adminId = req.admin?._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // Just pass the image path string
    const updatedAdmin = await updateAdminProfileImage(adminId, req.file.path);

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: updatedAdmin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
};



export { loginAdmin, updateAdmin, uploadAdminProfilePicture };
