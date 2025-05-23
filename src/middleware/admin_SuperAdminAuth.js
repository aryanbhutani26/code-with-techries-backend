// middleware/protectAdminOrSuperAdmin.js
import jwt from "jsonwebtoken";
import Admin from "../schema/adminSchema.js";

export const protectAdminOrSuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email === process.env.SUPER_ADMIN_EMAIL) {
      req.superAdmin = true;
      return next();
    }

    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.admin = admin;
      return next();
    }

    res.status(403).json({ message: "Forbidden: Not authorized" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
