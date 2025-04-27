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
    console.log(req.body); // Add this before trying to create the teacher
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
    // Use req.user._id instead of req.teacher._id since your middleware assigns the teacher object to req.user
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
    // Don't allow the username to be updated.
    if (req.body.username) {
      delete req.body.username;
    }

    // Use req.user._id instead of req.teacher._id
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
    // Check if file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // The URL of the uploaded image in Cloudinary is in req.file.path
    const teacher = await updateTeacherProfile(req.user._id, {
      profilePicture: req.file.path, // Cloudinary URL of the image
      imageUrl: req.file.path, // Cloudinary URL of the image
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      teacher,
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
