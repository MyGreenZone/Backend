// middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require("../configs/envConfig");
const User = require('../src/auth/user.schema')
const Employee = require('../src/employee/employee.schema')
const { ROLE } = require('../constants')
const AuthMiddleWare = (() => {
  const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, config.SECRETKEY)
      // console.log('decoded', decoded)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ statusCode: 401, success: false, message: 'Token không hợp lệ hoặc hết hạn' });
    }
  };

  const authorize = async (phoneNumber, role) => {
    // console.log('role', role)
    if (role) {
      const Model = role === ROLE.CUSTOMER.value ? User : Employee;
      return await Model.findOne({ phoneNumber });
    }
    return null
  };


  return {
    verifyToken,
    authorize
  }

})()


module.exports = AuthMiddleWare
