const User = require('../auth/user.schema');
const { ROLE } = require('../../constants');
const userService = {
    async getProfile(phoneNumber, role) {
        if (role !== ROLE.CUSTOMER.value) {
            return {
                statusCode: 401,
                success: false,
                message: 'Unauthorized'
            }
        }
        const user = await User.findOne({ phoneNumber }).lean();
        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found'
            }
        }
        return {
            statusCode: 200,
            success: true,
            data: user
        }
    },

    async updateProfile(phoneNumber, role, requestBody) {
        if (role !== ROLE.CUSTOMER.value) {
            return {
                statusCode: 401,
                success: false,
                message: 'Unauthorized'
            }
        }
        const user = await User.findOneAndUpdate({ phoneNumber }, requestBody, { new: true })
        return {
            statusCode: 200,
            success: true,
            data: user
        }
    }
}

module.exports = userService;
