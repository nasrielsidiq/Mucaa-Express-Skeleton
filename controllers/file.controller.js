import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import File from "../models/file.model.js";
import User from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../uploads");

/**
 * @desc Upload image file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadImageFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileType = req.params.type || "images";
    const filePath = path.join("/uploads", fileType, req.file.filename);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: filePath,
        url: `${req.protocol}://${req.get("host")}${filePath}`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Upload user profile photo and link to user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.params.userId || req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const filePath = path.join("/uploads/profiles", req.file.filename);
    const fileUrl = `${req.protocol}://${req.get("host")}${filePath}`;

    // Create file record
    const fileRecord = await File.create({
    //   user_id: userId,
      filename: req.file.filename,
      original_name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      file_path: filePath,
      file_url: fileUrl,
      file_type: "profile",
    });


    // Delete old profile photo if exists
    const oldFile = await File.findById(user.file_id);
    if (oldFile) {
      const oldFilePath = path.join(__dirname, "../uploads/profiles", oldFile.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      await File.delete(oldFile.id);
    }

    // Update user with new file_id
    await User.update(userId, { file_id: fileRecord.id });

    res.status(201).json({
      success: true,
      message: "Profile photo uploaded and linked successfully",
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        originalName: fileRecord.original_name,
        mimetype: fileRecord.mimetype,
        size: fileRecord.size,
        url: fileUrl,
      },
      user: {
        id: userId,
        file_id: fileRecord.id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Get user profile photo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.file_id) {
      return res.status(404).json({ error: "User has no profile photo" });
    }

    const file = await File.findById(user.file_id);
    if (!file) {
      return res.status(404).json({ error: "Profile photo not found" });
    }

    res.status(200).json({
      success: true,
      file: {
        id: file.id,
        filename: file.filename,
        originalName: file.original_name,
        mimetype: file.mimetype,
        size: file.size,
        url: file.file_url,
        uploadedAt: file.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Delete user profile photo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.file_id) {
      return res.status(404).json({ error: "User has no profile photo" });
    }

    const file = await File.findById(user.file_id);
    if (!file) {
      return res.status(404).json({ error: "Profile photo not found" });
    }

    const filePath = path.join(__dirname, "../uploads/profiles", file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove file_id from user
    await User.update(userId, { file_id: null });
    await File.delete(file.id);

    res.status(200).json({
      success: true,
      message: "Profile photo deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Upload document file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadDocumentFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join("/uploads/documents", req.file.filename);

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: filePath,
        url: `${req.protocol}://${req.get("host")}${filePath}`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Upload multiple files
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileType = req.params.type || "images";
    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${fileType}/${file.filename}`,
      url: `${req.protocol}://${req.get("host")}/uploads/${fileType}/${file.filename}`,
    }));

    res.status(201).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      files,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Get file info
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFileInfo = (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(uploadsDir, type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const stats = fs.statSync(filePath);

    res.status(200).json({
      success: true,
      file: {
        filename,
        type,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: filePath,
        url: `${req.protocol}://${req.get("host")}/uploads/${type}/${filename}`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Delete file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteFile = (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(uploadsDir, type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc List files in directory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const listFiles = (req, res) => {
  try {
    const { type } = req.params;
    const dirPath = path.join(uploadsDir, type);

    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({ error: "Directory not found" });
    }

    const files = fs.readdirSync(dirPath).map((filename) => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `${req.protocol}://${req.get("host")}/uploads/${type}/${filename}`,
      };
    });

    res.status(200).json({
      success: true,
      type,
      count: files.length,
      files,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
