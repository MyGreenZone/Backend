// category.service.js
const Category = require('./category.schema')
const categoryService = {
    async createCategory(data) {
        const newCategory = await Category.create(data)
        return { statusCode: 201, message: 'Created category successfully', data: newCategory }
    },

    async getAllCategories() {
        const categories = await Category.find()
        return { statusCode: 200, message: 'Get all categories successfully', data: categories }
    },

    async updateCategory(categoryId, data) {
        const newCategory = await Category.findByIdAndUpdate(categoryId, data, {
            new: true,
            runValidators: true,
        });
        if (!newCategory) {
            return { statusCode: 404, success: false, message: 'Không tìm thấy Category' };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Cập nhật category thành công',
            data: newCategory,
        }

    }
}

module.exports = categoryService