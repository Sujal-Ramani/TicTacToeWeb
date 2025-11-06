const jwt = require("jsonwebtoken");

// Middleware to protect routes
const auth = (req, res, next) => {
  // Extract token from Authorization header
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "Authorization token required" });

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret_dev");
    req.user = payload; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
