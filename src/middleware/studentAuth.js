import jwt from "jsonwebtoken";
import Student from "../schema/studentSchema.js";

export const protectStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id).select("-password");
    if (!student) {
      return res.status(401).json({ error: "Unauthorized - Invalid user" });
    }

    req.student = student;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized - Token failed" });
  }
};
