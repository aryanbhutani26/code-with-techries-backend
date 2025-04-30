import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../schema/studentSchema.js";
import Developer from "../schema/developerSchema.js";
import Recruiter from "../schema/recruiterSchema.js";


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    let role = null;

    // First check Student collection
    user = await Student.findOne({ email });
    if (user) {
      role = "student";
    }

    // If not found in Student, check Developer collection
    if (!user) {
      user = await Developer.findOne({ email });
      if (user) {
        role = "developer";
      }
    }

    // If not found in Developer, check Recruiter collection
    if (!user) {
      user = await Recruiter.findOne({ email });
      if (user) {
        role = "recruiter";
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET, // Make sure you have JWT_SECRET in your .env
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
      token,
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export { loginUser };
