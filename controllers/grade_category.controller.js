import GradeCategory from "../models/grade_category.model.js";

// GET all grade categories
export const getAllGradeCategories = async (req, res, next) => {
  try {
    const categories = await GradeCategory.findAll();
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// GET grade category by ID
export const getGradeCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await GradeCategory.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Grade category not found" });
    }

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// GET grade category by name
export const getGradeCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const category = await GradeCategory.findByName(name);

    if (!category) {
      return res.status(404).json({ error: "Grade category not found" });
    }

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// GET parent categories
export const getParentCategories = async (req, res, next) => {
  try {
    const categories = await GradeCategory.findParents();
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// GET child categories
export const getChildCategories = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const categories = await GradeCategory.findChildren(categoryId);

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE grade category
export const createGradeCategory = async (req, res, next) => {
  try {
    const { name, description, category_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const category = await GradeCategory.create({ name, description, category_id });

    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE grade category
export const updateGradeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category_id } = req.body;

    const category = await GradeCategory.update(id, { name, description, category_id });

    if (!category) {
      return res.status(404).json({ error: "Grade category not found" });
    }

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE grade category
export const deleteGradeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await GradeCategory.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Grade category not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Grade category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
