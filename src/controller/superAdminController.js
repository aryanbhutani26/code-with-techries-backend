import Admin from "../schema/adminSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const loginSuperAdmin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Super Admin logged in successfully",
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating admin",
      error: err.message,
    });
  }
};

export { loginSuperAdmin, createAdmin };
