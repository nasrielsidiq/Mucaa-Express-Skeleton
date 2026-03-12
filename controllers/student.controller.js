import Student from "../models/student.model.js";

// GET all students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({
      status: "success",
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

// GET student by ID
export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// GET student by user ID
export const getStudentByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const student = await Student.findByUserId(userId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// GET student by NIP
export const getStudentByNip = async (req, res, next) => {
  try {
    const { nip } = req.params;
    const student = await Student.findByNip(nip);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// GET students by group ID
export const getStudentsByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const students = await Student.findByGroupId(groupId);

    res.status(200).json({
      status: "success",
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE student
export const createStudent = async (req, res, next) => {
  try {
    const { nip, user_id, group_id, grade, religion } = req.body;

    if (!nip || !user_id || !group_id || !grade || !religion) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = await Student.create({ nip, user_id, group_id, grade, religion });

    res.status(201).json({
      status: "success",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE student
export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { group_id, grade, religion } = req.body;

    if (!group_id && !grade && !religion) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const student = await Student.update(id, { group_id, grade, religion });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE student
export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Student.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Student deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
