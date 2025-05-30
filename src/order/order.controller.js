const orderService = require('./order.service')
const { createOrderValidator, updateOrderValidator, updatePaymentStatusValidator } = require('./order.validator')


const orderController = {
    async createOrder(req, res) {
        const { value, error } = createOrderValidator.validate(req.body, { abortEarly: false, convert: true });
        if (error) {
            const errors = error.details.map(err => ({
                message: err.message,
                field: err.context.label
            }));
            return res.status(400).json({
                statusCode: 400,
                success: false,
                error: errors,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }

        try {
            const { phoneNumber, role } = req.user
            const result = await orderService.createOrder(phoneNumber, role, value);
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        } catch (error) {
            console.log("Error creating order:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error creating order',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },

    async getStoreOrders(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { status } = req.query
            const result = await orderService.getStoreOrders(phoneNumber, role, status)
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            })
        } catch (error) {
            console.log('Error get store orders', error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get store orders',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },
     async getTodayStoreOrders(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { status } = req.query
            const result = await orderService.getStoreOrders(phoneNumber, role, status)
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            })
        } catch (error) {
            console.log('Error get store orders', error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get store orders',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },


    async getMyOrders(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { status } = req.query
            const result = await orderService.getMyOrders(phoneNumber, role, status)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log('Error get my orders', error)
            return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error. Path: /v1/order/my-orders ' })
        }
    },

    async getOrderDetail(req, res) {
        const { orderId } = req.params
        if (!orderId) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Missing productId' })
        }

        try {
            const { phoneNumber, role } = req.user
            const result = await orderService.getOrderDetail(phoneNumber, role, orderId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error get order detail:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get order detail'
            });
        }

    },

    async updateOrderStatus(req, res) {
        const { value: validateValue, error } = updateOrderValidator.validate(req.body, { abortEarly: false })

        if (error) {
            const errors = error.details.map(err => {
                return { message: err.message, field: err.context.field }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        try {
            const { phoneNumber, role } = req.user

            const { orderId } = req.params
            if (!orderId) {
                return res.status(400).json({ statusCode: 500, success: false, message: 'Missing orderId' })
            }

            const result = await orderService.updateOrderStatus(phoneNumber, role, orderId, validateValue)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log('Error update order status', error)
            return res.status(500).json({ statusCode: 500, success: false, message: `Internal server error. Update order status Error:${error} ` })
        }
    },

    async updatePaymentStatus(req, res) {
        const { value: validateValue, error } = updatePaymentStatusValidator.validate(req.body, { abortEarly: false })

        if (error) {
            const errors = error.details.map(err => {
                return { message: err.message, field: err.context.field }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        try {
            const { phoneNumber, role } = req.user

            const { orderId } = req.params
            if (!orderId) {
                return res.status(400).json({ statusCode: 500, success: false, message: 'Missing orderId' })
            }

            const result = await orderService.updatePaymentStatus(phoneNumber, role, orderId, validateValue)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log('Error update payment status', error)
            return res.status(500).json({ statusCode: 500, success: false, message: `Internal server error. Update payment status Error:${error} ` })
        }
    }







}

module.exports = orderController