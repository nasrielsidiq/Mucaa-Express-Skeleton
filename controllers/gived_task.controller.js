import GivedTask from "../models/gived_task.model.js";

// GET all gived tasks
export const getAllGivedTasks = async (req, res, next) => {
  try {
    const givedTasks = await GivedTask.findAll();
    res.status(200).json({
      status: "success",
      data: givedTasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET gived task by ID
export const getGivedTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const givedTask = await GivedTask.findById(id);

    if (!givedTask) {
      return res.status(404).json({ error: "Gived task not found" });
    }

    res.status(200).json({
      status: "success",
      data: givedTask,
    });
  } catch (err) {
    next(err);
  }
};

// GET gived tasks by task ID
export const getGivedTasksByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const givedTasks = await GivedTask.findByTaskId(taskId);

    res.status(200).json({
      status: "success",
      data: givedTasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET gived tasks by student ID
export const getGivedTasksByStudentId = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const givedTasks = await GivedTask.findByStudentId(studentId);

    res.status(200).json({
      status: "success",
      data: givedTasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET gived tasks by status
export const getGivedTasksByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const givedTasks = await GivedTask.findByStatus(status);

    res.status(200).json({
      status: "success",
      data: givedTasks,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE gived task
export const createGivedTask = async (req, res, next) => {
  try {
    const { task_id, student_id, filepath, rates, status } = req.body;

    if (!task_id || !student_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const givedTask = await GivedTask.create({ task_id, student_id, filepath, rates, status });

    res.status(201).json({
      status: "success",
      data: givedTask,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE gived task
export const updateGivedTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filepath, rates, status } = req.body;

    const givedTask = await GivedTask.update(id, { filepath, rates, status });

    if (!givedTask) {
      return res.status(404).json({ error: "Gived task not found" });
    }

    res.status(200).json({
      status: "success",
      data: givedTask,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE gived task
export const deleteGivedTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await GivedTask.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Gived task not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Gived task deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
