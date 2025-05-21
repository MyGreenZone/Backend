const variantController = require('./variant.controller')
const express = require('express')

const variantRouter = express.Router()

/**
 * @swagger
 * /v1/variant/create/{productId}:
 *   post:
 *     summary: Tạo biến thể sản phẩm 
 *     tags:
 *       - Variant
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của biến thể sản phẩm
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
 *               size:
 *                 type: string
 *                 enum: [S, M, L, XL]
 *                 example: M
 *               sellingPrice:
 *                 type: number
 *                 minimum: 1000
 *                 example: 25000
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tạo biến thể thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Đầu vào không hợp lệ
 *       401:
 *         description: Sai mật khẩu quản trị viên
 *       404:
 *         description: Không tìm thấy biến thể
 *       500:
 *         description: Lỗi server
 */
variantRouter.post('/create/:productId', variantController.createVariant);

/**
 * @swagger
 * /v1/variant/{variantId}:
 *   patch:
 *     summary: Cập nhật biến thể sản phẩm
 *     tags:
 *       - Variant
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của biến thể sản phẩm
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
 *               size:
 *                 type: string
 *                 enum: [S, M, L, XL]
 *                 example: M
 *               sellingPrice:
 *                 type: number
 *                 minimum: 1000
 *                 example: 25000
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật biến thể thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Đầu vào không hợp lệ
 *       401:
 *         description: Sai mật khẩu quản trị viên
 *       404:
 *         description: Không tìm thấy biến thể
 *       500:
 *         description: Lỗi server
 */
variantRouter.patch('/:variantId', variantController.patchVariant);




/**
 * @swagger
 * /v1/variant/{variantId}:
 *   get:
 *     summary: Lấy chi tiết một biến thể sản phẩm (variant)
 *     tags:
 *       - Variant
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của variant cần lấy thông tin
 *     responses:
 *       200:
 *         description: Lấy chi tiết variant thành công
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
 *                   example: Get variant detail successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Không tìm thấy variant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Variant not found
 *       500:
 *         description: Lỗi server
 */
variantRouter.get('/:variantId', variantController.getVariantDetail);


module.exports = variantRouter