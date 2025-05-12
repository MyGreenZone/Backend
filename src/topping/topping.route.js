

const toppingController = require('./topping.controller')
const express = require('express')
const toppingRouter = express.Router()

/**
 * @swagger
 * /v1/topping/create:
 *   post:
 *     summary: Tạo topping mới
 *     tags:
 *       - Topping
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *                 example: Trân châu đen
 *               extraPrice:
 *                 type: integer
 *                 example: 8000
 *     responses:
 *       201:
 *         description: Tạo topping thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     extraPrice:
 *                       type: integer
 *       400:
 *         description: Lỗi dữ liệu đầu vào không hợp lệ
 *       409:
 *         description: Topping trùng tên
 *       500:
 *         description: Lỗi server khi tạo topping
 */
toppingRouter.post('/create', toppingController.createTopping)




/**
 * @swagger
 * /v1/topping/all:
 *   get:
 *     summary: Lấy danh sách tất cả topping
 *     tags:
 *       - Topping
 *     responses:
 *       200:
 *         description: Lấy danh sách topping thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       extraPrice:
 *                         type: integer
 *       500:
 *         description: Lỗi server khi lấy danh sách topping
 */
toppingRouter.get('/all', toppingController.getAllToppings)


/**
 * @swagger
 * /v1/topping/{toppingId}:
 *   put:
 *     summary: Cập nhật thông tin topping
 *     tags:
 *       - Topping
 *     parameters:
 *       - in: path
 *         name: toppingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của topping cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *                 example: Trân châu trắng
 *               extraPrice:
 *                 type: integer
 *                 example: 9000
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Update topping successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     extraPrice:
 *                       type: integer
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy topping
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Topping not found
 *       409:
 *         description: Tên topping đã tồn tại
 *       500:
 *         description: Lỗi server khi cập nhật topping
 */
toppingRouter.put('/:toppingId', toppingController.updateTopping)



module.exports = toppingRouter