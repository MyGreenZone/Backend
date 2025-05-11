// category.service.js
const Category = require('./category.schema')
const categoryService = {
    async createCategory(data) {
        const newCategory = await Category.create(data)
        return { statusCode: 201, message: 'Created category successfully', data: newCategory }
    },

    async getAllCategories(){
        const categories = await Category.find()
        return { statusCode: 200, message: 'Get all categories successfully', data: categories }
    }
}

module.exports = categoryService