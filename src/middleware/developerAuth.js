import jwt from "jsonwebtoken";
import Developer from "../schema/developerSchema.js";

export const protectDeveloper = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const developer = await Developer.findById(decoded.id).select("-password");

    if (!developer) return res.status(401).json({ message: "Developer not found" });

    req.user = developer;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};
