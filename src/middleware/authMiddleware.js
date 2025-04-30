import jwt from "jsonwebtoken";

export const protect = (roles = []) => {
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
