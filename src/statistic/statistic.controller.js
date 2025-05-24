const statisticService = require('./statistic.service')

const statisticController = {
    async getMonthlyOrders(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { year } = req.query
            const result = await statisticService.getMonthlyOrderCount(phoneNumber, role, year)
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            })
        } catch (error) {
            console.log('Error getMonthlyOrders', error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error getMonthlyOrders',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },


    async getMonthlyRevenue(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { year } = req.query
            const result = await statisticService.getMonthlyRevenue(phoneNumber, role, year)
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            })
        } catch (error) {
            console.log('Error getMonthlyRevenue', error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error getMonthlyRevenue',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },

    async getMonthlyRevenueAdmin(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { year, storeId } = req.params
            const result = await statisticService.getMonthlyRevenueAdmin(phoneNumber, role, storeId, year)
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            })
        } catch (error) {
            console.log('Error getMonthlyRevenueAdmin', error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error getMonthlyRevenueAdmin',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },



    async getMonthlyOrdersAdmin(req, res) {
        try {
            const { phoneNumber, role } = req.user

            const { year, storeId} = req.params
            const result = await statisticService.getMonthlyOrdersAdmin(phoneNumber, role, storeId, year)
            return res.status(result.statusCode).json({
                ...result,
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            })
        } catch (error) {
            console.log('Error getMonthlyOrdersAdmin', error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error getMonthlyOrdersAdmin',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
    },

}

module.exports = statisticController