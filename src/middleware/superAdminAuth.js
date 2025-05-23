import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protectSuperAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.email !== process.env.SUPER_ADMIN_EMAIL
    ) {
      return res.status(403).json({ message: "Forbidden: Not a super admin" });
    }

    req.superAdmin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
