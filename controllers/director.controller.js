import Director from "../models/director.model.js";

// GET all directors
export const getAllDirectors = async (req, res, next) => {
  try {
    const directors = await Director.findAll();
    res.status(200).json({
      status: "success",
      data: directors,
    });
  } catch (err) {
    next(err);
  }
};

// GET director by ID
export const getDirectorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const director = await Director.findById(id);

    if (!director) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.status(200).json({
      status: "success",
      data: director,
    });
  } catch (err) {
    next(err);
  }
};

// GET director by user ID
export const getDirectorByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const director = await Director.findByUserId(userId);

    if (!director) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.status(200).json({
      status: "success",
      data: director,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE director
export const createDirector = async (req, res, next) => {
  try {
    const { user_id, nrp, position, unit } = req.body;

    if (!user_id || !nrp || !position || !unit) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const director = await Director.create({ user_id, nrp, position, unit });

    res.status(201).json({
      status: "success",
      data: director,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE director
export const updateDirector = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { position, unit } = req.body;

    if (!position && !unit) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const director = await Director.update(id, { position, unit });

    if (!director) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.status(200).json({
      status: "success",
      data: director,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE director
export const deleteDirector = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Director.delete(id);

    if (!result) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Director deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
