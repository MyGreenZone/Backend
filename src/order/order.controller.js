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
        }else{
            return res.status(201).json({statusCode: 201, success: true, message: 'Test pass'})
        }
    }


}

module.exports = orderController