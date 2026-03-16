import Performance from "../models/performance.model.js";

// ─── Get All ────────────────────────────────────────────
export const getPerformances = async (req, res) => {
  try {
    const performances = await Performance.findAll();
    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get By ID ───────────────────────────────────────────
export const getPerformanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const performance = await Performance.findById(id);

    if (!performance) {
      return res.status(404).json({ error: "Performance not found" });
    }

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get By Student ID ──────────────────────────────────
export const getPerformanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const performances = await Performance.findByStudentId(studentId);

    if (performances.length === 0) {
      return res.status(404).json({ error: "No performances found for this student" });
    }

    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get By Teacher ID ──────────────────────────────────
export const getPerformanceByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const performances = await Performance.findByTeacherId(teacherId);

    if (performances.length === 0) {
      return res.status(404).json({ error: "No performances found for this teacher" });
    }

    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get By Task ID ─────────────────────────────────────
export const getPerformanceByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const performances = await Performance.findByTaskId(taskId);

    if (performances.length === 0) {
      return res.status(404).json({ error: "No performances found for this task" });
    }

    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get By Category ID ─────────────────────────────────
export const getPerformanceByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const performances = await Performance.findByCategoryId(categoryId);

    if (performances.length === 0) {
      return res.status(404).json({ error: "No performances found in this category" });
    }

    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Create ─────────────────────────────────────────────
export const createPerformance = async (req, res) => {
  try {
    const { student_id, teacher_id, task_id, grade_category_id, grade } = req.body;

    // Validation
    if (!student_id || !teacher_id || !task_id || !grade) {
      return res.status(400).json({ error: "Missing required fields: student_id, teacher_id, task_id, grade" });
    }

    const performance = await Performance.create({
      student_id,
      teacher_id,
      task_id,
      grade_category_id,
      grade,
    });

    res.status(201).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Update ─────────────────────────────────────────────
export const updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, grade_category_id } = req.body;

    const performance = await Performance.findById(id);
    if (!performance) {
      return res.status(404).json({ error: "Performance not found" });
    }

    const updated = await Performance.update(id, {
      grade,
      grade_category_id,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Delete ─────────────────────────────────────────────
export const deletePerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const performance = await Performance.findById(id);
    if (!performance) {
      return res.status(404).json({ error: "Performance not found" });
    }

    const success = await Performance.delete(id);

    if (!success) {
      return res.status(500).json({ error: "Failed to delete performance" });
    }

    res.status(200).json({ message: "Performance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
