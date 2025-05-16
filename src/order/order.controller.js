const orderService = require('./order.service')
const { createOrderValidator } = require('./order.validator')
const mongoose = require('mongoose')

const orderController = {
    async createOrder(req, res) {
        const { value, error } = createOrderValidator.validate(req.body, { abortEarly: false, convert: true })
        if (error) {
            const errors = error.details.map(err => {
                return { message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        try {
            const result = await orderService.createOrder(value);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error creating order:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error creating order:',
            });
        }
    },

    async getOrderDetail(req, res) {
        const { orderId } = req.params
        if (!orderId) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Missing productId' })
        }
        
        try {
            const result = await orderService.getOrderDetail(orderId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error get order detail:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get order detail'
            });
        }

    }




}

module.exports = orderController