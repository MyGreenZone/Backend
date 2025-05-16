const orderController = require('./order.controller')
const express = require('express')

const orderRouter = express.Router()


orderRouter.post('/create', orderController.createOrder)
orderRouter.get('/:orderId', orderController.getOrderDetail)


module.exports = orderRouter