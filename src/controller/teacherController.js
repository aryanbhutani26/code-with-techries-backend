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

export const registerTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;
    const teacherExists = await findTeacherByUsername(username);
    if (teacherExists) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const teacher = await createTeacher({ username, password });
    res.status(201).json({
      success: true,
      message: "Teacher registered",
      token: generateToken(teacher._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;
    const teacher = await findTeacherByUsername(username);
    if (!teacher || !(await teacher.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(teacher._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getTeacherProfile = async (req, res) => {
  const teacher = await findTeacherById(req.teacher._id);
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.status(200).json({ success: true, teacher });
};

export const updateTeacher = async (req, res) => {
  try {
    if (req.body.username) {
      delete req.body.username;
    }
    const updated = await updateTeacherProfile(req.teacher._id, req.body);
    res
      .status(200)
      .json({ success: true, message: "Profile updated", teacher: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const getTeacherByUsername = async (req, res) => {
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

export const uploadTeacherImage = async (req, res) => {
  try {
    const teacher = await updateTeacherProfile(req.teacher._id, {
      profilePicture: req.file?.path || "",
      imageUrl: req.file?.path || "",
    });
    res.status(200).json({
      success: true,
      message: "Profile image updated",
      teacher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Image upload failed",
      details: err.message,
    });
  }
};

export const deleteTeacherByUsername = async (req, res) => {
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
