import Group from "../models/group.model.js";

// GET all groups
export const getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json({
      status: "success",
      data: groups,
    });
  } catch (err) {
    next(err);
  }
};

// GET group by ID
export const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      status: "success",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

// GET group by name
export const getGroupByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const group = await Group.findByName(name);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      status: "success",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

// GET groups by grade
export const getGroupsByGrade = async (req, res, next) => {
  try {
    const { grade } = req.params;
    const groups = await Group.findByGrade(grade);

    res.status(200).json({
      status: "success",
      data: groups,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE group
export const createGroup = async (req, res, next) => {
  try {
    const { name, grade } = req.body;

    if (!name || !grade) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const group = await Group.create({ name, grade });

    res.status(201).json({
      status: "success",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE group
export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, grade } = req.body;

    if (!name && !grade) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const group = await Group.update(id, { name, grade });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      status: "success",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE group
export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Group.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Group deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
