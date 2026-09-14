import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  mine: user.mine,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, mine } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "moc_admin" ? "moc_admin" : "mine_admin",
      mine: mine || null,
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: (email || "").toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    user: sanitize(req.user),
  });
};