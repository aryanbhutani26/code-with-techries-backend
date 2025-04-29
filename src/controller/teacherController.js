import {
  createTeacher,
  findTeacherByUsername,
  findTeacherById,
  updateTeacherProfile,
  deleteTeacher,
} from "../service/teacherService.js";
import jwt from "jsonwebtoken";
import Teacher from "../schema/teacherSchema.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerTeacher = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    const teacherExists = await findTeacherByUsername(username);
    if (teacherExists) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const teacher = await createTeacher(req.body);
    res.status(201).json({
      success: true,
      message: "Teacher registered",
      teacher,
      token: generateToken(teacher._id),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

const loginTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;
    const teacher = await findTeacherByUsername(username);
    if (!teacher || !(await teacher.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      success: true,
      message: "Login successful",
      teacher,
      token: generateToken(teacher._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await findTeacherById(req.user._id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      success: true,
      message: "Teacher profile retrieved",
      teacher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving teacher profile",
      error: err.message,
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    if (req.body.username) {
      delete req.body.username;
    }

    const updated = await updateTeacherProfile(req.user._id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      teacher: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

const getTeacherByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const teacher = await Teacher.findOne({ username });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher retrieved successfully",
      teacher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving teacher",
      error: err.message,
    });
  }
};

const uploadTeacherImage = async (req, res) => {
  try {
    const teacherId = req.user?._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const updatedTeacher = await updateTeacherProfile(teacherId, {
      profilePicture: req.file.path,
      imageUrl: req.file.path,
    });

    if (!updatedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: updatedTeacher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
};

const deleteTeacherByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const deletedTeacher = await deleteTeacher(username);

    if (!deletedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: err.message,
    });
  }
};

export {
  loginTeacher,
  registerTeacher,
  getTeacherProfile,
  updateTeacher,
  getTeacherByUsername,
  uploadTeacherImage,
  deleteTeacherByUsername,
};
