const express = require('express')
const productController = require('./product.controller')
const productRouter = express.Router()

productRouter.post('/create', productController.createProduct)
module.exports = productRouter