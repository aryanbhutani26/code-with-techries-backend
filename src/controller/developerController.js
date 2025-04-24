import jwt from "jsonwebtoken";
import Developer from "../schema/developerSchema.js";
import bcrypt from "bcrypt";
import {
  createDeveloper,
  findDeveloperByEmail,
  findDeveloperById,
  updateDeveloperById,
  deleteDeveloperById,
} from "../service/developerService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerDeveloper = async (req, res) => {
  try {
    const developer = await createDeveloper(req.body);
    res.status(201).json({
      success: true,
      message: "Developer registered successfully",
      token: generateToken(developer._id),
      developer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

const loginDeveloper = async (req, res) => {
  const { email, password } = req.body;

  try {
    const developer = await findDeveloperByEmail(email);
    if (!developer || !(await developer.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token: generateToken(developer._id),
      developer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login error",
      error: err.message,
    });
  }
};

const getDeveloperProfile = async (req, res) => {
  try {
    const developer = await findDeveloperById(req.user._id);
    res.status(200).json({ success: true, developer });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Developer not found",
      error: err.message,
    });
  }
};

const updateDeveloperProfile = async (req, res) => {
  try {
    const updated = await updateDeveloperById(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      developer: updated,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

const deleteDeveloper = async (req, res) => {
  try {
    await deleteDeveloperById(req.user._id);
    res.status(200).json({
      success: true,
      message: "Developer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting developer",
      error: err.message,
    });
  }
};

const fetchDeveloperByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const recruiter = await findDeveloperByEmail(email);

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

const uploadDeveloperProfilePicture = async (req, res) => {
  try {
    req.developer = req.user;
    const developer = await updateDeveloperById(req.developer._id, {
      profilePicture: req.file?.path || "",
      imageUrl: req.file?.path || "",
    });

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      developer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Image upload failed",
      details: err.message,
    });
  }
};

const changeDeveloperPassword = async (req, res) => {
  try {
    req.developer = req.user;
    const { currentPassword, newPassword } = req.body;
    const developer = await Developer.findById(req.developer._id);

    const isMatch = await bcrypt.compare(currentPassword, developer.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect current password" });

    developer.password = newPassword;
    await developer.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      suceess: false,
      message: "Failed to change password",
      error: err.message,
    });
  }
};

export {
  registerDeveloper,
  loginDeveloper,
  deleteDeveloper,
  updateDeveloperProfile,
  uploadDeveloperProfilePicture,
  changeDeveloperPassword,
  fetchDeveloperByEmail,
  getDeveloperProfile,
};
