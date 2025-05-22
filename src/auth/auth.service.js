const Employee = require('../employee/employee.schema')
const config = require("../../configs/envConfig");
const jwt = require('jsonwebtoken');


const authService = {
    async employeeLogin(requestBody) {
        const { phoneNumber, password } = requestBody
        const employee = await Employee.findOne({ phoneNumber: phoneNumber.toString() })
        if (!employee || employee.password !== password)
            return { statusCode: 400, success: false, message: 'Wrong phone number or password' }


        const accessToken = jwt.sign(
            { typeToken: 'accessToken', phoneNumber },
            config.SECRETKEY,
            { expiresIn: '10d' } // 864000s
        );

        const refreshToken = jwt.sign(
            { typeToken: 'refreshToken', phoneNumber },
            config.SECRETKEY,
            { expiresIn: '30d' } // 2592000s
        );


        return {
            statusCode: 200,
            success: true,
            message: 'Login successfully',
            data: {
                user: employee,
                token: {
                    accessToken: {
                        token: accessToken,
                        expiresIn: 864000
                    },
                    refreshToken: {
                        token: refreshToken,
                        expiresIn: 2592000
                    }
                }
            }
        }
    }
}

module.exports = authService