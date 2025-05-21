const voucherController = require('./voucher.controller')
const express = require('express')
const AuthMiddleWare = require('../../middleware/auth')
const voucherRouter = express.Router()


/**
 * @swagger
 * /v1/voucher/create:
 *   post:
 *     summary: Tạo voucher mới
 *     tags:
 *       - Voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - name
 *               - image
 *               - description
 *               - code
 *               - voucherType
 *               - discountType
 *               - value
 *               - requiredPoints
 *               - startDate
 *               - endDate
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               description:
 *                 type: string
 *               code:
 *                 type: string
 *               voucherType:
 *                 type: string
 *                 example: global
 *               discountType:
 *                 type: string
 *                 example: percentage
 *               value:
 *                 type: number
 *               requiredPoints:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-27T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-01T00:00:00.000Z
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Tạo voucher thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
voucherRouter.post('/create', voucherController.createVoucher)



/**
 * @swagger
 * /v1/voucher/all:
 *   get:
 *     summary: Lấy danh sách tất cả các voucher
 *     tags:
 *       - Voucher
 *     responses:
 *       200:
 *         description: Danh sách voucher được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Lỗi server
 */
voucherRouter.get('/all', voucherController.getAllVouchers)


/**
 * @swagger
 * /v1/voucher/my-voucher:
 *   get:
 *     summary: Lấy danh sách voucher của người dùng
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách voucher thành công
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
 *                   example: Get my vouchers successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
 *       500:
 *         description: Lỗi server (Internal Server Error)
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
 *                   example: Error get my vouchers
 */
voucherRouter.get('/my-voucher', AuthMiddleWare.authenticateJWT, voucherController.getMyVouchers);


/**
 * @swagger
 * /v1/voucher/{voucherId}:
 *   get:
 *     summary: Lấy chi tiết một voucher
 *     tags:
 *       - Voucher
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của voucher cần lấy
 *     responses:
 *       200:
 *         description: Trả về chi tiết voucher
 *       404:
 *         description: Không tìm thấy voucher
 *       500:
 *         description: Lỗi server
 */
voucherRouter.get('/:voucherId', voucherController.getVoucherDetail)



/**
 * @swagger
 * /v1/voucher/{voucherId}:
 *   put:
 *     summary: Cập nhật thông tin voucher
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của voucher cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               code:
 *                 type: string
 *               voucherType:
 *                 type: string
 *                 enum: [global, seed]
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixedAmount]
 *               value:
 *                 type: number
 *               requiredPoints:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-15T13:00:19.052Z
 *               endDate:
 *                 type: string
 *                 example: 2025-06-15T13:00:19.052Z
 *                 description: Ngày kết thúc áp dụng
 *     responses:
 *       200:
 *         description: Cập nhật voucher thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc mã đã tồn tại
 *       404:
 *         description: Không tìm thấy voucher
 */
voucherRouter.put('/:voucherId', voucherController.updateVoucher)


voucherRouter.put('/exchange/:voucherId', AuthMiddleWare.authenticateJWT, voucherController.exchangeSeed)/**
 * @swagger
 * /v1/voucher/exchange/{voucherId}:
 *   put:
 *     summary: Exchange seed points for a voucher
 *     tags:
 *       - Voucher
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher to exchange
 *     responses:
 *       200:
 *         description: Exchange voucher successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request or not enough seed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Server error
 */
voucherRouter.put(
  '/exchange/:voucherId',
  AuthMiddleWare.authenticateJWT,
  voucherController.exchangeSeed
);






module.exports = voucherRouter