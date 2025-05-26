const userService = require('./user.service');
const { updateProfileValidator } = require('./user.validator');
const userController = {
    async getProfile(req, res) {
        try {
            const { phoneNumber, role } = req.user;
            const result = await userService.getProfile(phoneNumber, role);
            res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },

    async updateProfile(req, res) {
        const { error } = updateProfileValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }

        try {
            const { phoneNumber, role } = req.user;
            const result = await userService.updateProfile(phoneNumber, role, req.body);
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    }
}

module.exports = userController;
