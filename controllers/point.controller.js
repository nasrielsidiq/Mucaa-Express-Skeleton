import Point from "../models/point.model.js";

// GET all points
export const getAllPoints = async (req, res, next) => {
  try {
    const points = await Point.findAll();
    res.status(200).json({ status: "success", data: points });
  } catch (err) {
    next(err);
  }
};

// GET point by ID
export const getPointById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const point = await Point.findById(id);
    if (!point) return res.status(404).json({ error: "Point not found" });
    res.status(200).json({ status: "success", data: point });
  } catch (err) {
    next(err);
  }
};

// GET points by category
export const getPointsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params; // 'Prestasi' or 'Pelanggaran'
    const points = await Point.findByCategory(category);
    res.status(200).json({ status: "success", data: points });
  } catch (err) {
    next(err);
  }
};

// CREATE point
export const createPoint = async (req, res, next) => {
  try {
    const { name, category, points, description } = req.body;
    if (!name || !category || points === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newPoint = await Point.create({ name, category, points, description });
    res.status(201).json({ status: "success", data: newPoint });
  } catch (err) {
    next(err);
  }
};

// UPDATE point
export const updatePoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, points, description } = req.body;
    const updatedPoint = await Point.update(id, { name, category, points, description });
    if (!updatedPoint) return res.status(404).json({ error: "Point not found" });
    res.status(200).json({ status: "success", data: updatedPoint });
  } catch (err) {
    next(err);
  }
};

// DELETE point
export const deletePoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Point.delete(id);
    if (!result) return res.status(404).json({ error: "Point not found" });
    res.status(200).json({ status: "success", message: "Point deleted successfully" });
  } catch (err) {
    next(err);
  }
};
