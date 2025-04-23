import jwt from "jsonwebtoken";
import Recruiter from "../schema/recruiterSchema.js";

export const protectRecruiter = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.recruiter = await Recruiter.findById(decoded.id).select("-password");
    if (!req.recruiter) return res.status(404).json({ error: "Recruiter not found" });

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized", message: err.message });
  }
};
