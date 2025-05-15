const express = require('express')
const productController = require('./product.controller')
const productRouter = express.Router()



/**
 * @swagger
 * /v1/product/create:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags:
 *       - Product
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
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               sellingPrice:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     sellingPrice:
 *                       type: number
 *               toppingIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               password: admin123
 *               name: "Trà sữa thái xanh"
 *               description: "Ngon và mát"
 *               sellingPrice: 10000
 *               sizes:
 *                 - size: "M"
 *                   sellingPrice: 12000
 *                 - size: "L"
 *                   sellingPrice: 14000
 *               toppingIds: ["abc123", "def456"]
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f123abc..."
 *                     name:
 *                       type: string
 *                       example: "Trà sữa thái xanh"
 *                     description:
 *                       type: string
 *                       example: "Ngon và mát"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     variant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           size:
 *                             type: string
 *                             example: "M"
 *                           sellingPrice:
 *                             type: number
 *                             example: 12000
 *                     topping:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: "Trân châu đen"
 *                           price:
 *                             type: number
 *                             example: 5000
 *       400:
 *         description: Lỗi đầu vào
 *       500:
 *         description: Lỗi server
 */
productRouter.post('/create', productController.createProduct)




/**
 * @swagger
 * /v1/product/all:
 *   get:
 *     summary: Get all products with categories
 *     tags:
 *       - Product
 *     description: Retrieve a list of all products grouped by their categories.
 *     responses:
 *       200:
 *         description: Successfully fetched products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   description: Status code of the response.
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A message providing additional information about the request.
 *                   example: "Get all products successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Category ID.
 *                         example: "68207de10674b854f908edad"
 *                       name:
 *                         type: string
 *                         description: Category name.
 *                         example: "Trà sữa"
 *                       icon:
 *                         type: string
 *                         description: Icon URL for the category.
 *                         example: "https://res.cloudinary.com/dxhejgve0/image/upload/v1746961436/uploads/neqlsnjep05diiyd0glz.png"
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: Product ID.
 *                               example: "682402301261afcbcc29c3ca"
 *                             name:
 *                               type: string
 *                               description: Product name.
 *                               example: "Capuchino Lavender"
 *                             description:
 *                               type: string
 *                               description: Product description.
 *                               example: "A special twist on traditional cappuccino..."
 *                             image:
 *                               type: string
 *                               description: Product image URL.
 *                               example: "https://res.cloudinary.com/dxhejgve0/image/upload/v1747129926/uploads/dtbhhibef6mvbo4i469v.jpg"
 *       500:
 *         description: Internal server error
 */
productRouter.get('/all', productController.getAllProducts);




/**
 * @swagger
 * /v1/product/{productId}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
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
 *                       example: "64f123abc..."
 *                     name:
 *                       type: string
 *                       example: "Trà sữa truyền thống"
 *                     description:
 *                       type: string
 *                       example: "Trà sữa thơm ngon, đậm đà"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     variant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           size:
 *                             type: string
 *                             example: "Lớn"
 *                           sellingPrice:
 *                             type: number
 *                             example: 35000
 *                     topping:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: "Trân châu đen"
 *                           price:
 *                             type: number
 *                             example: 5000
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
productRouter.get('/:productId', productController.getProductDetail)




/**
 * @swagger
 * /v1/product/{productId}:
 *   patch:
 *     summary: Cập nhật thông tin sản phẩm
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần cập nhật
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
 *                 example: Trà sữa truyền thống
 *               description:
 *                 type: string
 *                 example: Thức uống quen thuộc với vị trà đậm và sữa béo
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *               sellingPrice:
 *                 type: number
 *                 example: 25000
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "64e47870d8b83477f52c7c10"
 *               toppingIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "64e47870d8b83477f52c7c12"
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
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
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Sai mật khẩu quản trị viên
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
productRouter.patch('/:productId', productController.patchProduct);





module.exports = productRouter