import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone_number, address, birth_date } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate role
    const validRoles = ['students', 'admin', 'teacher', 'director'];
    const userRole = role && validRoles.includes(role) ? role : 'students';

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone_number,
      address,
      birth_date,
    });
    const token = signToken(user.id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email, true); // include password
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await User.comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: "success",
      token,
      data: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role 
      },
    });
  } catch (err) {
    next(err);
  }
};