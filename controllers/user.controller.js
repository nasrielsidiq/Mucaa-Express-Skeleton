import User from "../models/user.model.js";

// GET /api/v1/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: "success", results: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.softDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};