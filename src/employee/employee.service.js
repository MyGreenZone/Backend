const Employee = require('../employee/employee.schema')
const Order = require('../order/order.schema')
const OrderStatus = require('../../constants/orderStatus.enum')
const Delivery = require('../delivery/delivery.schema')
const Store = require('../store/store.schema')
const mongoose = require('mongoose')
const { KEY } = require('../../constants')
const AuthMiddleWare = require('../../middleware/auth')

const employeeService = {
   async getAvailableEmployees(phoneNumber) {
      // authorize 
      const user = await AuthMiddleWare.authorize(phoneNumber, Employee)
      if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

      const busyEmployees = await Delivery.find({ isCompleted: false }).distinct('employee')
      const employees = await Employee.find({
         workingStore: user.workingStore,
         _id: { $nin: busyEmployees }
      }, '_id firstName lastName phoneNumber avatar workingStore').lean()

      return { statusCode: 200, success: true, message: 'Get available employees successfully', data: employees }
   }
}

module.exports = employeeService