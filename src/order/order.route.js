const orderController = require('./order.controller')
const express = require('express')
const { verifyToken, authenticateJWT } = require('../../middleware/auth')

const orderRouter = express.Router()
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /v1/order/create:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryMethod
 *               - fulfillmentDateTime
 *               - totalPrice
 *               - paymentMethod
 *               - owner
 *               - store
 *               - orderItems
 *             properties:
 *               deliveryMethod:
 *                 type: string
 *                 enum: [pickup, delivery]
 *               fulfillmentDateTime:
 *                 type: string
 *                 format: date-time
 *               totalPrice:
 *                 type: number
 *                 minimum: 0
 *               paymentMethod:
 *                 type: string
 *                 enum: [online, cod]
 *               owner:
 *                 type: string
 *               store:
 *                 type: string
 *               consigneeName:
 *                 type: string
 *               consigneePhone:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               voucher:
 *                 type: string
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [variant, quantity, price]
 *                   properties:
 *                     variant:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     toppingItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [topping, quantity, price]
 *                         properties:
 *                           topping:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           price:
 *                             type: number
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Lỗi dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server nội bộ
 */
orderRouter.post('/create', verifyToken, orderController.createOrder);

/**
 * @swagger
 * /v1/order/my-order:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['completed', 'cancelled']
 *         description: Trạng thái đơn hàng để lọc (bỏ trống để lấy đơn đang thực hiện)
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
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
 *                   example: Get orders successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Thông tin chi tiết từng đơn hàng
 *       401:
 *         description: Không được xác thực (thiếu hoặc sai token)
 *       500:
 *         description: Lỗi server nội bộ
 */
orderRouter.get('/my-order', verifyToken, orderController.getMyOrders);


/**
 * @swagger
 * /v1/order/{orderId}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng theo ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn hàng thành công
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
 *                   example: Get order detail successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: orderId không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server nội bộ
 */
orderRouter.get('/:orderId', authenticateJWT, orderController.getOrderDetail);








module.exports = orderRouter