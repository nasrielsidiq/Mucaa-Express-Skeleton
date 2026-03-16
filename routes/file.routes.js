import { Router } from "express";
import {
  uploadImageFile,
  uploadDocumentFile,
  uploadMultipleFiles,
  uploadProfilePhoto,
  getUserProfilePhoto,
  deleteProfilePhoto,
  getFileInfo,
  deleteFile,
  listFiles,
} from "../controllers/file.controller.js";
import { uploadImage, uploadDocument, uploadFile } from "../middleware/upload.middleware.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/files/upload/image/{type}:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload single image file
 *     description: Upload a single image file (jpg, jpeg, png, gif, webp). Max size 5MB.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [images, profile, task]
 *         description: Directory type for file storage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 file:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalName:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     path:
 *                       type: string
 *                     url:
 *                       type: string
 *       400:
 *         description: No file uploaded or invalid format
 *       413:
 *         description: File size exceeds 5MB limit
 */
router.post("/upload/image/:type", protect, uploadImage.single("file"), uploadImageFile);

/**
 * @swagger
 * /api/v1/files/profile/{userId}:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload and link user profile photo
 *     description: Upload a profile photo that automatically links to user record. Replaces previous profile photo if exists.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to link profile photo to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile photo uploaded and linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     file_id:
 *                       type: integer
 *       400:
 *         description: No file uploaded or invalid user ID
 *       404:
 *         description: User not found
 *       413:
 *         description: File size exceeds 5MB limit
 */
router.post("/profile/:userId", protect, uploadImage.single("file"), uploadProfilePhoto);

/**
 * @swagger
 * /api/v1/files/profile/{userId}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get user profile photo
 *     description: Retrieve user's profile photo information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile photo retrieved successfully
 *       404:
 *         description: User not found or has no profile photo
 */
router.get("/profile/:userId", protect, getUserProfilePhoto);

/**
 * @swagger
 * /api/v1/files/profile/{userId}:
 *   delete:
 *     tags:
 *       - Files
 *     summary: Delete user profile photo
 *     description: Delete user's profile photo and unlink from user record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile photo deleted successfully
 *       404:
 *         description: User not found or has no profile photo
 */
router.delete("/profile/:userId", protect, deleteProfilePhoto);

/**
 * @swagger
 * /api/v1/files/upload/document:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload single document file
 *     description: Upload a single document file (pdf, doc, docx). Max size 10MB.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: No file uploaded or invalid format
 *       413:
 *         description: File size exceeds 10MB limit
 */
router.post("/upload/document", protect, uploadDocument.single("file"), uploadDocumentFile);

/**
 * @swagger
 * /api/v1/files/upload/multiple/{type}:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload multiple image files
 *     description: Upload multiple image files at once (jpg, jpeg, png, gif, webp). Max size 5MB per file.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [images, profile, task]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *       400:
 *         description: No files uploaded
 */
router.post(
  "/upload/multiple/:type",
  protect,
  uploadImage.array("files", 10),
  uploadMultipleFiles
);

/**
 * @swagger
 * /api/v1/files/{type}/{filename}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get file information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File information retrieved
 *       404:
 *         description: File not found
 */
router.get("/:type/:filename", protect, getFileInfo);

/**
 * @swagger
 * /api/v1/files/list/{type}:
 *   get:
 *     tags:
 *       - Files
 *     summary: List all files in directory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [images, profiles, tasks, documents]
 *     responses:
 *       200:
 *         description: Files list retrieved
 *       404:
 *         description: Directory not found
 */
router.get("/list/:type", protect, listFiles);

/**
 * @swagger
 * /api/v1/files/{type}/{filename}:
 *   delete:
 *     tags:
 *       - Files
 *     summary: Delete file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 */
router.delete("/:type/:filename", protect, restrictTo("admin"), deleteFile);

export default router;
