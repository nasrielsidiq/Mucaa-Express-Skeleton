import Task from "../models/task.model.js";

// GET all tasks
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// GET tasks by teacher ID
export const getTasksByTeacherId = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const tasks = await Task.findByTeacherId(teacherId);

    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET tasks by status
export const getTasksByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const tasks = await Task.findByStatus(status);

    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET tasks by type
export const getTasksByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const tasks = await Task.findByType(type);

    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE task
export const createTask = async (req, res, next) => {
  try {
    const { teacher_id, title, description, type, start_date, due_date, start_time, due_time, status } = req.body;

    if (!teacher_id || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const task = await Task.create({
      teacher_id,
      title,
      description,
      type,
      start_date,
      due_date,
      start_time,
      due_time,
      status,
    });

    res.status(201).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE task
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, type, start_date, due_date, start_time, due_time, status } = req.body;

    const task = await Task.update(id, {
      title,
      description,
      type,
      start_date,
      due_date,
      start_time,
      due_time,
      status,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE task
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Task.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
