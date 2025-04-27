import jwt from "jsonwebtoken";
import Teacher from "../schema/teacherSchema.js";

export const protectTeacher = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id).select("-password");

    if (!teacher) return res.status(401).json({ message: "Teacher not found" });

    req.user = teacher;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};