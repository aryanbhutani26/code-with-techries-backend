import jwt from "jsonwebtoken";
import { findTeacherById } from "../service/teacherService.js";

export const protectTeacher = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await findTeacherById(decoded.id);
    if (!teacher) {
      return res.status(401).json({ message: "Teacher not found" });
    }
    req.teacher = teacher;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
