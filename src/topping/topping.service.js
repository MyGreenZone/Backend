// topping.service.js
const Topping = require('./topping.schema')
const toppingService = {
    async createTopping(data) {
        const existing = await Topping.findOne({ name: data.name })
        if (existing) {
            return { statusCode: 409, message: 'This topping name has been existed', }
        }
        const newTopping = await Topping.create(data)
        return { statusCode: 201, message: 'Created topping successfully', data: newTopping }
    },

    async getAllToppings() {
        const toppings = await Topping.find()
        return { statusCode: 200, message: 'Get all toppings successfully', data: toppings }
    },


    async updateTopping(toppingId, data) {
        const existingName = await Topping.findOne({ name: data.name })
        if (existingName) {
            return { statusCode: 409, message: 'This topping name has been existed', }
        }
        const newTopping = await Topping.findByIdAndUpdate(toppingId, data, {new: true})
        if(newTopping){
             return { statusCode: 404, message: 'Topping not found' }
        }
        return { statusCode: 200, message: 'Update topping successfully', data: newTopping }
    }
}

module.exports = toppingService