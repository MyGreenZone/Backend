const statisticController = require('./statistic.controller')
const express = require('express')
const AuthMiddleWare = require('../../middleware/auth')

const statisticRouter = express.Router()


/**
 * @swagger
 * /v1/statistic/order-count:
 *   get:
 *     summary: Lấy thống kê số lượng đơn hàng của cửa hàng theo tháng (Only for staff)
 *     tags:
 *       - Statistic
 *     security:
 *       - bearerAuth: []  # nếu bạn dùng Bearer token auth
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *     responses:
 *       200:
 *         description: Trả về danh sách số lượng đơn hàng theo tháng
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
 *                   example: Monthly order count for year 2024
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2024-01"
 *                       count:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Unauthorized - Không có quyền truy cập hoặc token không hợp lệ
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
 *                   example: Unauthorized
 */
statisticRouter.get('/order-count', AuthMiddleWare.verifyToken, statisticController.getMonthlyOrders);




/**
 * @swagger
 * /v1/statistic/revenue:
 *   get:
 *     summary: Thống kê doanh thu cửa hàng theo tháng trong năm (Only for staff)
 *     tags:
 *       - Statistic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *     responses:
 *       200:
 *         description: Trả về danh sách doanh thu theo tháng
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
 *                   example: Monthly revenue for year 2024
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2024-01"
 *                       totalRevenue:
 *                         type: number
 *                         example: 2500000
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 */
statisticRouter.get('/revenue', AuthMiddleWare.verifyToken, statisticController.getMonthlyRevenue);


/**
 * @swagger
 * /v1/statistic/admin/order-count/{storeId}/{year}:
 *   get:
 *     summary: Lấy thống kê số lượng đơn hàng của cửa hàng theo tháng (Only for Admin)
 *     tags:
 *       - Statistic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: ID của cửa hàng
 *         schema:
 *           type: string
 *       - name: year
 *         in: path
 *         required: true
 *         description: Năm cần thống kê
 *         schema:
 *           type: integer
 *           example: 2025
 *     responses:
 *       200:
 *         description: Trả về danh sách số lượng đơn hàng theo tháng
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
 *                   example: Monthly order count for year 2024
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2024-01"
 *                       count:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Unauthorized - Không có quyền truy cập hoặc token không hợp lệ
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
 *                   example: Unauthorized
 */
statisticRouter.get('/admin/order-count/:storeId/:year', AuthMiddleWare.verifyToken, statisticController.getMonthlyOrdersAdmin);



/**
 * @swagger
 * /v1/statistic/admin/revenue/{storeId}/{year}:
 *   get:
 *     summary: Thống kê doanh thu cửa hàng theo tháng trong năm (Only for Admin)
 *     tags:
 *       - Statistic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: ID của cửa hàng
 *         schema:
 *           type: string
 *       - name: year
 *         in: path
 *         required: true
 *         description: Năm cần thống kê 
 *         schema:
 *           type: integer
 *           example: 2025
 *     responses:
 *       200:
 *         description: Trả về danh sách doanh thu theo tháng
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
 *                   example: Monthly revenue for year 2024
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2024-01"
 *                       totalRevenue:
 *                         type: number
 *                         example: 2500000
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 */
statisticRouter.get('/admin/revenue/:storeId/:year', AuthMiddleWare.verifyToken, statisticController.getMonthlyRevenueAdmin);


module.exports = statisticRouter