const express = require('express')
const categoryRouter = express.Router()
const categoryController = require('./category.controller')

/**
 * @swagger
 * /v1/category/create:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - name
 *               - icon
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *                 example: Đồ gia dụng
 *               icon:
 *                 type: string
 *                 format: uri
 *                 example: https://cdn-icons-png.flaticon.com/512/123/123456.png
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Created category successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Password is required
 *       401:
 *         description: Không có quyền thực hiện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
categoryRouter.post('/create', categoryController.createCategory);


/**
 * @swagger
 * /v1/category/all:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách danh mục thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64fcb49c9d57d9f4c63b3700
 *                       name:
 *                         type: string
 *                         example: Đồ ăn
 *                       icon:
 *                         type: string
 *                         example: https://example.com/icon.png
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error get all categories
 */
categoryRouter.get('/all', categoryController.getAllCategories);



module.exports = categoryRouter