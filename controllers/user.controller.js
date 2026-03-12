import User from "../models/user.model.js";

// GET all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// GET user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// GET user by email
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE user
export const createUser = async (req, res, next) => {
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

    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, address, birth_date } = req.body;

    if (!name && !email && !phone_number && !address && !birth_date) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await User.update(id, {
      name,
      email,
      phone_number,
      address,
      birth_date,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE user (soft delete)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.softDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};