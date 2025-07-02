const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Admin credentials - in production, use environment variables and hashed passwords
const ADMIN_CREDENTIALS = {
  "nigel@ianaitch.com": "admin123",
  "elijah@ianaitch.com": "admin123",
};

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Admin login endpoint
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password }); // Debug log

    // Check if email exists in admin credentials
    if (!ADMIN_CREDENTIALS[email]) {
      console.log("Email not found in admin list");
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Check password (simple comparison for now)
    if (ADMIN_CREDENTIALS[email] !== password) {
      console.log("Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email,
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      },
      JWT_SECRET
    );

    console.log("Login successful for:", email);

    res.json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin" || !ADMIN_CREDENTIALS[decoded.email]) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Verify token endpoint
router.get("/verify-admin", verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

// Logout endpoint (optional - mainly for client-side cleanup)
router.post("/admin-logout", verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = { router, verifyAdminToken };
