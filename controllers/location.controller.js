import Location from "../models/location.model.js";

// GET all locations
export const getAllLocations = async (req, res, next) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json({ status: "success", data: locations });
  } catch (err) {
    next(err);
  }
};

// GET location by ID
export const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json({ status: "success", data: location });
  } catch (err) {
    next(err);
  }
};

// CREATE location
export const createLocation = async (req, res, next) => {
  try {
    const { name, icon, latitude, longitude, radius, status } = req.body;
    if (!name) return res.status(400).json({ error: "Missing 'name' field" });

    const newLocation = await Location.create({ name, icon, latitude, longitude, radius, status });
    res.status(201).json({ status: "success", data: newLocation });
  } catch (err) {
    next(err);
  }
};

// UPDATE location
export const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, latitude, longitude, radius, status } = req.body;

    const updatedLocation = await Location.update(id, { name, icon, latitude, longitude, radius, status });
    if (!updatedLocation) return res.status(404).json({ error: "Location not found" });

    res.status(200).json({ status: "success", data: updatedLocation });
  } catch (err) {
    next(err);
  }
};

// DELETE location
export const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Location.delete(id);
    if (!result) return res.status(404).json({ error: "Location not found" });
    res.status(200).json({ status: "success", message: "Location deleted successfully" });
  } catch (err) {
    next(err);
  }
};
