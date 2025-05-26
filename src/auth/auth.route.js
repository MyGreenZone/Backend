const express = require('express');
const authController = require('./auth.controller');
const AuthMiddleWare = require('../../middleware/auth')
const userController = require('../user/user.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const authRouter = express.Router();

/**
 * @swagger
 * /auth/otp/send:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send OTP to phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: '0779188717'
 *             required:
 *               - phoneNumber
 *     responses:
 *       201:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number
 *       500:
 *         description: Internal server error
 */
authRouter.post('/otp/send', authController.sendOtp);


/**
 * @swagger
 * /auth/otp/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP and Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, code]
 *             properties:
 *               phoneNumber: { type: string, example: "0779188717" }
 *               code: { type: string, example: "150871" }
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: integer, example: 201 }
 *                 success: { type: boolean, example: true }
 *                 data: { type: object, properties: { user: {type: object}, token: { type: object } } }
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
authRouter.post('/otp/login', authController.verifyOtp);


/**
 * @swagger
 * /auth/otp/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register New Account after authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lastName]
 *             properties:
 *               firstName: { type: string, example: "Nguyen Van" }
 *               lastName: { type: string, example: "A" }
 *               email: { type: string, example: "greenzone@example.com" }
 *               dateOfBirth: { type: string, format: date, example: "1995-06-15" }
 *               gender: { type: string, enum: [male, female, other], example: "male" }
 *     responses:
 *       201:
 *         description: Cập nhật thông tin người dùng thành công
 *       400:
 *         description: Thiếu họ tên hoặc dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (thiếu hoặc sai token)
 *       500:
 *         description: Lỗi hệ thống
 */
authRouter.post('/otp/register', AuthMiddleWare.verifyToken, authController.register)



/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công (Only for customer)
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60b88f8b9f1b2c1aefb8dfcb"
 *                     phoneNumber:
 *                       type: string
 *                       example: "0912345678"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     verifyPhoneNumber:
 *                       type: boolean
 *                       example: true
 *                     verifyMail:
 *                       type: boolean
 *                       example: true
 *                     firstName:
 *                       type: string
 *                       example: "Nguyen"
 *                     lastName:
 *                       type: string
 *                       example: "A"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1995-06-15"
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60b88f8b9f1b2c1aefb8dfcc"
 *                           name:
 *                             type: string
 *                             example: "customer"
 *       401:
 *         description: Không có quyền truy cập (token JWT thiếu hoặc không hợp lệ)
 *       403:
 *         description: Forbidden (token JWT hết hạn hoặc không hợp lệ)
 *       500:
 *         description: Lỗi hệ thống
 */
authRouter.get('/profile', AuthMiddleWare.verifyToken, userController.getProfile);



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Employee login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "0333333333"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: object
 *                           properties:
 *                             token:
 *                               type: string
 *                             expiresIn:
 *                               type: number
 *                         refreshToken:
 *                           type: object
 *                           properties:
 *                             token:
 *                               type: string
 *                             expiresIn:
 *                               type: number
 *       400:
 *         description: Sai số điện thoại hoặc mật khẩu
 */
authRouter.post('/login', authController.employeeLogin);




module.exports = authRouter;
