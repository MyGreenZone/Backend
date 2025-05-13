const express = require('express')
const productController = require('./product.controller')
const productRouter = express.Router()


/**
 * @swagger
 * /v1/product/create:
 *   post:
 *     summary: Create a new product with variants and toppings
 *     description: Create a new product. If sizes are provided, create variants for each size. If no sizes are provided, a default variant is created.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - defaultSellingPrice
 *             properties:
 *               password:
 *                 type: string
 *                 description: Admin password
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               description:
 *                 type: string
 *                 description: The description of the product
 *               image:
 *                 type: string
 *                 description: URL of the product image
 *               defaultSellingPrice:
 *                 type: number
 *                 description: Default selling price for the product
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                       description: The name of the size (e.g., "S", "M", "L")
 *                     sellingPrice:
 *                       type: number
 *                       description: Price for this size
 *               toppingIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of topping IDs
 *             example:
 *               password: "admin123"
 *               name: "Product A"
 *               description: "Delicious product"
 *               image: "http://example.com/image.jpg"
 *               defaultSellingPrice: 10000
 *               sizes: 
 *                 - size: "M"
 *                   sellingPrice: 12000
 *                 - size: "L"
 *                   sellingPrice: 14000
 *               toppingIds: ["toppingId1", "toppingId2"]
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                       description: The ID of the created product
 *                     name:
 *                       type: string
 *                       description: The name of the created product
 *                     description:
 *                       type: string
 *                       description: The description of the created product
 *                     image:
 *                       type: string
 *                       description: URL of the product image
 *                     variant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size:
 *                             type: string
 *                             description: The size of the variant
 *                           sellingPrice:
 *                             type: number
 *                             description: Price of the variant
 *                     topping:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The ID of the topping
 *                           name:
 *                             type: string
 *                             description: The name of the topping
 *       400:
 *         description: Validation error or duplicate size
 *       500:
 *         description: Internal server error
 */
productRouter.post('/create', productController.createProduct)
module.exports = productRouter