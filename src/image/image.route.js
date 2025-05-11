// routes/fileRoutes.js

const express = require('express');
const upload = require('../../configs/uploadConfig');
const { uploadSingleFile } = require('./image.controller');
const authenticateJWT = require('../../middleware/auth');  // Import middleware xác thực JWT

const fileRouter = express.Router();

// Route upload file với xác thực JWT

/**
 * @swagger
 * /file/image/upload:
 *   post:
 *     summary: Upload một file hình ảnh lên Cloudinary
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Không có file được gửi
 *       401:
 *         description: Không có hoặc token không hợp lệ
 *       500:
 *         description: Lỗi phía server
 */
fileRouter.post(
    '/image/upload',
    authenticateJWT,
    upload.single('file'),
    uploadSingleFile
);




module.exports = fileRouter;
