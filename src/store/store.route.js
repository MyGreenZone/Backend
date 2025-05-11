const express = require('express');
const storeRouter = express.Router()
const { createStore, getAllStores, getStoreDetail, updateStore } = require('./store.controller')


/**
 * @swagger
 * /v1/store/create:
 *   post:
 *     summary: Tạo mới một cửa hàng
 *     tags:
 *       - Store
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - name
 *               - phoneNumber
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *                 example: GreenZone Tô Ký
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://example.com/image1.jpg
 *                   - https://example.com/image2.jpg
 *               openTime:
 *                 type: string
 *                 example: "08:00:00"
 *               closeTime:
 *                 type: string
 *                 example: "21:00:00"
 *               address:
 *                 type: string
 *                 example: 102 Tô Ký, Quận 12, Hồ Chí Minh
 *               latitude:
 *                 type: string
 *                 example: "10.848647"
 *               longitude:
 *                 type: string
 *                 example: "106.633871"
 *     responses:
 *       201:
 *         description: Tạo store thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   default: 201
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ hoặc đã tồn tại store
 *       500:
 *         description: Lỗi server
 */
storeRouter.post('/create', createStore)




/**
 * @swagger
 * /v1/store/all:
 *   get:
 *     summary: Lấy danh sách cửa hàng 
 *     tags:
 *       - Store
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Số trang cần lấy
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Số lượng cửa hàng mỗi trang
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách cửa hàng và thông tin phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   default: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Get all stores successfully'
 *                 data:
 *                   type: object
 *       500:
 *         description: Lỗi máy chủ, không thể lấy cửa hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   default: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
storeRouter.get('/all', getAllStores);


/**
 * @swagger
 * /v1/store/{storeId}:
 *   get:
 *     summary: Get store detail by ID
 *     tags:
 *       - Store
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved store detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   default: 200
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing or invalid storeId
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
storeRouter.get('/:storeId', getStoreDetail);


/**
 * @swagger
 * /v1/store/{storeId}:
 *   put:
 *     summary: Cập nhật thông tin store
 *     tags:
 *       - Store
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của store cần cập nhật
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
 *               phoneNumber:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               openTime:
 *                 type: string
 *               closeTime:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Store updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Thiếu thông tin hoặc password sai
 *       404:
 *         description: Không tìm thấy store
 *       500:
 *         description: Lỗi server nội bộ
 */
storeRouter.put('/:storeId', updateStore);




module.exports = storeRouter