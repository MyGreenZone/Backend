// category.controller.js

const categoryService = require('./category.service')
const { categoryValidator } = require('./category.validator')
const mongoose = require('mongoose')


const categoryController = {
    async createCategory(req, res) {
        const { value, error } = categoryValidator.validate(req.body, { abortEarly: false })

        if (error) {
            const errors = error.details.map((err) => {
                return { message: err.message, field: err.context.label }
            })
            return res.status(400).json({
                statusCode: 400,
                success: false,
                errors: errors
            })
        }

        try {
            const newCategory = await categoryService.createCategory(value)
            return res.status(newCategory.statusCode).json(newCategory)
        } catch (error) {
            console.log("Error creating category:", err);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi tạo danh mục',
            });
        }
    },


    async getAllCategories(req, res) {
        try {
            const result = await categoryService.getAllCategories();
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error get all categories:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get all categories',
            });
        }
    },

    async updateCategory(req, res) {
        const { categoryId } = req.params
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng categoryId' });
        }

        const { value, error } = categoryValidator.validate(req.body, { abortEarly: false })
        if (error) {
            const errors = error.details.map((err) => {
                return { message: err.message, field: err.context.label }
            })
            return res.status(400).json({
                statusCode: 400,
                success: false,
                errors: errors
            })
        }

        try {
            const newCategory = await categoryService.updateCategory(categoryId, value)
            return res.status(newCategory.statusCode).json(newCategory)
        } catch (error) {
            console.log("Error updating category:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi update danh mục',
            });
        }

    }
}




module.exports = categoryController