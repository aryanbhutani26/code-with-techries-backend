import jwt from "jsonwebtoken";
import {
  createRecruiter,
  findRecruiterByEmail,
  updateRecruiter,
  deleteRecruiterById,
} from "../service/recruiterService.js";
import Recruiter from "../schema/recruiterSchema.js";
import bcrypt from "bcrypt";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerRecruiter = async (req, res) => {
  try {
    const existing = await findRecruiterByEmail(req.body.email);
    if (existing)
      return res.status(400).json({ error: "Recruiter already exists" });

    const recruiter = await createRecruiter(req.body);
    const token = generateToken(recruiter._id);
    res.status(201).json({
      success: true,
      message: "Successfully register",
      recruiter,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Registration failed",
      details: err.message,
    });
  }
};

const loginRecruiter = async (req, res) => {
  try {
    const recruiter = await findRecruiterByEmail(req.body.email);
    if (!recruiter)
      return res.status(404).json({ error: "Recruiter not found" });

    const isMatch = await recruiter.matchPassword(req.body.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(recruiter._id);
    res.status(200).json({
      success: true,
      message: "successfully LogedIn",
      recruiter,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Login failed",
      details: err.message,
    });
  }
};

const getRecruiterProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      student: req.recruiter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const fetchRecruiterByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const recruiter = await findRecruiterByEmail(email);

    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: "Recruiter not found" });
    }

    res.status(200).json({
      success: true,
      message: "Recruiter fetched Successfully",
      recruiter,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching recruiter",
      error: err.message,
    });
  }
};

const updateRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await updateRecruiter(req.recruiter._id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      recruiter,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Profile update failed",
      details: err.message,
    });
  }
};

const uploadRecruiterImage = async (req, res) => {
  try {
    const recruiter = await updateRecruiter(req.recruiter._id, {
      profilePicture: req.file?.path || "",
      imageUrl: req.file?.path || "",
    });
    res.status(200).json({
      success: true,
      message: "Profile image updated",
      recruiter,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Image upload failed",
      details: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const recruiter = await Recruiter.findById(req.recruiter._id);

    const isMatch = await bcrypt.compare(currentPassword, recruiter.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect current password" });

    recruiter.password = newPassword; // Will get hashed via pre-save hook
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      suceess: false,
      error: "Failed to change password",
    });
  }
};

const deleteRecruiter = async (req, res) => {
  try {
    const recruiterId = req.recruiter._id; 
    const deleted = await deleteRecruiterById(recruiterId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recruiter deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting recruiter",
      error: err.message,
    });
  }
};

export {
  registerRecruiter,
  loginRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadRecruiterImage,
  changePassword,
  fetchRecruiterByEmail,
  deleteRecruiter,
};
