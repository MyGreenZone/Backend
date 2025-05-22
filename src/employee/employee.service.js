const Employee = require('../employee/employee.schema')
const Order = require('../order/order.schema')
const OrderStatus = require('../../constants/orderStatus.enum')
const Store = require('../store/store.schema')
const mongoose = require('mongoose')
const { KEY } = require('../../constants')
const AuthMiddleWare = require('../../middleware/auth')

const employeeService = {
   async getAvailableEmployees(phoneNumber) {
      const user = await AuthMiddleWare.authorize(phoneNumber, Employee)
      if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

      const employees = await Employee.find()


      const busyEmployees = await Order.find({ status: OrderStatus.COMPLETED.value})

      return { statusCode: 200, success: false, message: 'Get available employees successfully', data: employees }
   }
}

module.exports = employeeService