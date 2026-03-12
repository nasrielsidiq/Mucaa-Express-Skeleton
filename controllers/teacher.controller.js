import Teacher from "../models/teacher.model.js";

// GET all teachers
export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.findAll();
    res.status(200).json({
      status: "success",
      data: teachers,
    });
  } catch (err) {
    next(err);
  }
};

// GET teacher by ID
export const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({
      status: "success",
      data: teacher,
    });
  } catch (err) {
    next(err);
  }
};

// GET teacher by user ID
export const getTeacherByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const teacher = await Teacher.findByUserId(userId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({
      status: "success",
      data: teacher,
    });
  } catch (err) {
    next(err);
  }
};

// GET teacher by NRP
export const getTeacherByNrp = async (req, res, next) => {
  try {
    const { nrp } = req.params;
    const teacher = await Teacher.findByNrp(nrp);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({
      status: "success",
      data: teacher,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE teacher
export const createTeacher = async (req, res, next) => {
  try {
    const { user_id, nrp, rank, position } = req.body;

    if (!user_id || !nrp || !rank || !position) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const teacher = await Teacher.create({ user_id, nrp, rank, position });

    res.status(201).json({
      status: "success",
      data: teacher,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE teacher
export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rank, position } = req.body;

    if (!rank && !position) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const teacher = await Teacher.update(id, { rank, position });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({
      status: "success",
      data: teacher,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE teacher
export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Teacher.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Teacher deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
