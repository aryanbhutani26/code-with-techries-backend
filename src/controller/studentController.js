import {
  registerStudent,
  loginStudent,
  updateStudentProfile,
} from "../service/studentService.js";

import Student from "../schema/studentSchema.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const result = await registerStudent(req.body);
    res.status(201).json({
      success: true,
      message: "Student register successfully",
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error in registration",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginStudent(req.body);
    res.status(200).json({
      success: true,
      message: "Student logged In successfully.",
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Not loogedIn",
      error: err.message,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      student: req.student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const studentId = req.student._id;
    const updatedData = req.body;

    const updatedStudent = await updateStudentProfile(studentId, updatedData);
    res.status(200).json({
      success: true,
      message: "Profile updated",
      student: updatedStudent,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error in updating your profile",
      error: err.message,
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    const imagePath = req.file.path; // public_id or file path
    const imageUrl = req.file?.path || ""; // secure_url if using cloudinary-multer

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      {
        profilePicture: imagePath,
        imageUrl: imageUrl,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      imageUrl: imageUrl,
      student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in uploading profile picture",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.student._id);

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect current password" });

    student.password = newPassword; // Will get hashed via pre-save hook
    await student.save();

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

export {
  register,
  login,
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture,
  changePassword,
};
