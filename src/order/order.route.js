const orderController = require('./order.controller')
const express = require('express')

const orderRouter = express.Router()


orderRouter.post('/create', orderController.createOrder)
module.exports = orderRouter