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

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      let admin = await getAdminByEmail(ADMIN_EMAIL);
  
      // Create admin if not exists
      if (!admin) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const newAdmin = new Admin({
          name: "Admin",
          email: ADMIN_EMAIL,
          password: hashedPassword,
        });
        admin = await newAdmin.save();
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

export const updateAdminNameController = async (req, res) => {
  try {
    const updatedAdmin = await updateAdminName(req.admin._id, req.body.name);
    res.status(200).json({
      success: true,
      message: "Name updated",
      admin: updatedAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const uploadAdminProfilePicture = async (req, res) => {
  try {
    const updatedAdmin = await updateAdminProfileImage(
      req.admin._id,
      req.file?.path || ""
    );

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      admin: updatedAdmin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
};
