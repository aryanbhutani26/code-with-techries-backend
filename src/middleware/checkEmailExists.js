import Student from "../schema/studentSchema.js";
import Teacher from "../schema/teacherSchema.js";
import Developer from "../schema/developerSchema.js";
import Recruiter from "../schema/recruiterSchema.js";

const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const existingUser =
      (await Student.findOne({ email })) ||
      (await Teacher.findOne({ email })) ||
      (await Developer.findOne({ email })) ||
      (await Recruiter.findOne({ email }));

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    next(); // email is unique, proceed
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export default checkEmailExists;
