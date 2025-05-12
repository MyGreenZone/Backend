// topping.controller.js
const toppingService = require('./topping.service')
const toppingValidator = require('./topping.validator')
const mongoose = require('mongoose')

const toppingController = {
    async createTopping(req, res) {
        const { value, error } = toppingValidator.validate(req.body, { abortEarly: false, convert: false })

        if (error) {
            const errors = error.details.map(err => {
                return { statusCode: 400, message: error.message, field: err.context.label }
            })

            return res.status(400).json({
                statusCode: 400,
                success: false,
                errors: errors
            })
        }

        try {
            const result = await toppingService.createTopping(value)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error creating Topping:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi tạo Topping',
            });
        }

    },

    async getAllToppings(req, res) {
        try {
            const result = await toppingService.getAllToppings()
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error get all toppings:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi get all toppings',
            });
        }
    },

    async updateTopping(req, res) {
        const { toppingId } = req.params
        if (!mongoose.Types.ObjectId.isValid(toppingId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng toppingId' });
        }


        const { value, error } = toppingValidator.validate(req.body, { abortEarly: false, convert: false })

        if (error) {
            const errors = error.details.map(err => {
                return { statusCode: 400, message: error.message, field: err.context.label }
            })

            return res.status(400).json({
                statusCode: 400,
                success: false,
                errors: errors
            })
        }

        try {
            const result = await toppingService.updateTopping(toppingId, value)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error update Topping:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi update Topping',
            });
        }
    }
}

module.exports = toppingController;