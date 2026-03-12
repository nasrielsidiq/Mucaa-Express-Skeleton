import Grade from "../models/grade.model.js";

// GET all grades
export const getAllGrades = async (req, res, next) => {
  try {
    const grades = await Grade.findAll();
    res.status(200).json({
      status: "success",
      data: grades,
    });
  } catch (err) {
    next(err);
  }
};

// GET grade by ID
export const getGradeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await Grade.findById(id);

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    res.status(200).json({
      status: "success",
      data: grade,
    });
  } catch (err) {
    next(err);
  }
};

// GET grades by student ID
export const getGradesByStudentId = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.findByStudentId(studentId);

    res.status(200).json({
      status: "success",
      data: grades,
    });
  } catch (err) {
    next(err);
  }
};

// GET grades by teacher ID
export const getGradesByTeacherId = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const grades = await Grade.findByTeacherId(teacherId);

    res.status(200).json({
      status: "success",
      data: grades,
    });
  } catch (err) {
    next(err);
  }
};

// GET grades by task ID
export const getGradesByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const grades = await Grade.findByTaskId(taskId);

    res.status(200).json({
      status: "success",
      data: grades,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE grade
export const createGrade = async (req, res, next) => {
  try {
    const { student_id, teacher_id, grade_category_id, task_id, grade } = req.body;

    if (!student_id || !teacher_id || !task_id || !grade) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newGrade = await Grade.create({
      student_id,
      teacher_id,
      grade_category_id,
      task_id,
      grade,
    });

    res.status(201).json({
      status: "success",
      data: newGrade,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE grade
export const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { grade_category_id, grade } = req.body;

    const updatedGrade = await Grade.update(id, { grade_category_id, grade });

    if (!updatedGrade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedGrade,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE grade
export const deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Grade.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Grade not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Grade deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
