import {
  registerStudent,
  loginStudent,
  updateStudentProfile,
  getStudentByEmail,
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
      message: "Login Failed",
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

const fetchStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await getStudentByEmail(email);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching student",
        error: err.message,
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

const uploadStudentProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile picture.",
      });
    }

    const studentId = req.student.id;

    const profilePictureUrl = req.file.path; 

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        profilePicture: profilePictureUrl,
        imageUrl: profilePictureUrl,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: updatedStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
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

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student",
      error: error.message,
    });
  }
};

export {
  register,
  login,
  getMyProfile,
  updateMyProfile,
  uploadStudentProfilePicture,
  changePassword,
  fetchStudentByEmail,
  deleteStudent,
};
