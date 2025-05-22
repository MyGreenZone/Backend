const Employee = require('../employee/employee.schema')
const Delivery = require('../delivery/delivery.schema')
const { ROLE } = require('../../constants')
const AuthMiddleWare = require('../../middleware/auth')

const employeeService = {
   async getAvailableEmployees(phoneNumber, role) {
      // authorize 
      if (role === ROLE.CUSTOMER.value) return { statusCode: 401, success: false, message: 'Unauthorized' }
      const user = await AuthMiddleWare.authorize(phoneNumber, role)
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