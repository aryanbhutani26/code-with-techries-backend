import jwt from "jsonwebtoken";
import Recruiter from "../schema/recruiterSchema.js";
import Admin from "../schema/adminSchema.js";
import Developer from "../schema/developerSchema.js";
import dotenv from "dotenv";

dotenv.config();

const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized, token missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden, access denied" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
    }
  };
};


const protectRecruiterOrAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding recruiter
    const recruiter = await Recruiter.findById(decoded.id);
    if (recruiter) {
      req.user = recruiter;
      req.userType = "recruiter";
      req.user.role = "recruiter";
      return next();
    }

    // Try finding admin
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.user = admin;
      req.userType = "admin";
      req.user.role = "admin";
      return next();
    }

    return res.status(403).json({ message: "Access denied. Not recruiter or admin." });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};


const protectDeveloperOrAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding recruiter
    const developer = await Developer.findById(decoded.id);
    if (developer) {
      req.user = developer;
      req.userType = "developer";
      req.user.role = "developer";
      return next();
    }

    // Try finding admin
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.user = admin;
      req.userType = "admin";
      req.user.role = "admin";
      return next();
    }

    return res.status(403).json({ message: "Access denied. Not recruiter or admin." });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

export { protect, protectRecruiterOrAdmin, protectDeveloperOrAdmin };