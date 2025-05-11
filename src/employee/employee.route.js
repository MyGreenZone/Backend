const express = require('express');
const employeeRouter = express.Router()
const { createEmployee, getAllEmployees, getEmployeeDetail, updateEmployee, getAvailableEmployees } = require('./employee.controller')


/**
 * @swagger
 * /v1/employee/create:
 *   post:
 *     summary: Tạo nhân viên mới
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - avatar
 *               - workingStore
 *             properties:
 *               password:
 *                 type: string
 *                 example: admin123
 *               firstName:
 *                 type: string
 *                 example: Nguyễn
 *               lastName:
 *                 type: string
 *                 example: Văn A
 *               email:
 *                 type: string
 *                 example: nguyenvana@example.com
 *               gender:
 *                 type: string
 *                 example: Nam
 *               phoneNumber:
 *                 type: string
 *                 example: 0901234567
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               workingStore:
 *                 type: string
 *                 example: store123
 *     responses:
 *       201:
 *         description: Tạo nhân viên thành công
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
 *                   example: Created employee successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Lỗi đầu vào hoặc sai mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Wrong password
 *       409:
 *         description: Số điện thoại đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Số điện thoại đã đăng ký trước đó
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
employeeRouter.post('/create', createEmployee)


/**
 * @swagger
 * /v1/employee/all:
 *   get:
 *     summary: Lấy danh sách tất cả nhân viên
 *     tags:
 *       - Employee
 *     responses:
 *       200:
 *         description: Danh sách nhân viên được trả về thành công
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
 *                   type: array
 *                   
 *                     
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
employeeRouter.get('/all', getAllEmployees)

/**
 * @swagger
 * /v1/employee/{employeeId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của nhân viên theo ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhân viên
 *     responses:
 *       200:
 *         description: Lấy thông tin nhân viên thành công
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
 *       400:
 *         description: Định dạng ID không hợp lệ
 *       404:
 *         description: Không tìm thấy nhân viên
 *       500:
 *         description: Lỗi server
 */
employeeRouter.get('/:employeeId', getEmployeeDetail)

/**
 * @swagger
 * /v1/employee/{employeeId}:
 *   put:
 *     summary: Cập nhật thông tin nhân viên
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhân viên
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
 *               firstName:
 *                 type: string
 *                 example: Nguyễn
 *               lastName:
 *                 type: string
 *                 example: Văn A
 *               email:
 *                 type: string
 *                 example: nguyenvana@example.com
 *               gender:
 *                 type: string
 *                 example: Nam
 *               phoneNumber:
 *                 type: string
 *                 example: 0901234567
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               workingStore:
 *                 type: string
 *                 example: store123
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: ID không hợp lệ hoặc lỗi đầu vào
 *       404:
 *         description: Không tìm thấy nhân viên
 *       500:
 *         description: Lỗi server
 */
employeeRouter.put('/:employeeId', updateEmployee);



module.exports = employeeRouter