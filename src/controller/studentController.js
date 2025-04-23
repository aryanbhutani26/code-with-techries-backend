import { registerStudent, loginStudent } from "../service/studentService.js";

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

export { register, login, getMyProfile };
