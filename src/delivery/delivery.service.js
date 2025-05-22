const mongoose = require('mongoose')
const Delivery = require('./delivery.schema')
const Employee = require('../employee/employee.schema')

const deliveryService = {
    async assignDelivery(employeeId, order) {
        const employeeInfo = await Employee.findById(employeeId).lean()

        if (employeeInfo.workingStore !== order.store)
            return { statusCode: 400, success: false, message: 'Cannot assign an employee besides store' }
        // check busy
        const busy = await Delivery.findOne({ employee: employeeId, isCompleted: false })
        if (busy)
            return { statusCode: 400, success: false, message: 'This employee is busy now' }

        // after check
        const newDelivery = await Delivery.create({ employee: employeeId, order: order._id })
        return { statusCode: 201, success: true, message: 'Create delivery successfully', data: newDelivery }
    },

    async completeDelivery(data) {
        const { employee, order } = data
        const delivery = await Delivery.findOne({ employee, order, isCompleted: false })


        if (delivery) {
            delivery.isCompleted = true
            await delivery.save()
            return { statusCode: 200, success: true, message: 'Completed delivery successfully', data: delivery }
        }
        return { statusCode: 404, success: false, message: 'Update failed. Cannot find delivery' }

    }

   
}

module.exports = deliveryService