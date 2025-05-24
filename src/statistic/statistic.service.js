const { ROLE } = require('../../constants')
const mongoose = require('mongoose')
const Order = require('../order/order.schema')
const AuthMiddleWare = require('../../middleware/auth')


const statisticService = {
    async getMonthlyOrderCount(phoneNumber, role, year) {
        // Auth check
        if (role === ROLE.STAFF.value)
            return { statusCode: 401, success: false, message: 'Unauthorized' }

        const staff = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!staff)
            return { statusCode: 401, success: false, message: 'Unauthorized' }

        const storeId = staff.workingStore

        const selectedYear = parseInt(year) || new Date().getFullYear();

        const from = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const to = new Date(`${selectedYear}-12-31T23:59:59.999Z`)

        const stats = await Order.aggregate([
            {
                $match: {
                    store: storeId,
                    createdAt: { $gte: from, $lte: to }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: [
                                    { $lte: ["$_id.month", 9] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    count: 1
                }
            },
            { $sort: { month: 1 } } // sắp xếp tăng dần theo thời gian
        ])

        const fullStats = [];
        for (let i = 1; i <= 12; i++) {
            const monthStr = `${selectedYear}-${i < 10 ? "0" + i : i}`;
            const stat = stats.find(item => item.month === monthStr);
            fullStats.push({
                month: monthStr,
                count: stat ? stat.count : 0
            });
        }


        return {
            statusCode: 200,
            success: true,
            message: `Monthly order count for year ${selectedYear}`,
            data: fullStats
        };
    },


    async getMonthlyRevenue(phoneNumber, role, year) {
        if (role !== ROLE.STAFF.value)
            return { statusCode: 401, success: false, message: 'Unauthorized' };

        const staff = await AuthMiddleWare.authorize(phoneNumber, role);
        if (!staff)
            return { statusCode: 401, success: false, message: 'Unauthorized' };

        const storeId = staff.workingStore;
        const selectedYear = parseInt(year) || new Date().getFullYear();

        const from = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const to = new Date(`${selectedYear}-12-31T23:59:59.999Z`);

        // Aggregate tính tổng doanh thu (totalPrice) theo tháng
        const stats = await Order.aggregate([
            {
                $match: {
                    store: storeId,
                    createdAt: { $gte: from, $lte: to },
                    status: "completed" // Ví dụ chỉ tính đơn hàng hoàn thành
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: selectedYear },
                            "-",
                            {
                                $cond: [
                                    { $lte: ["$_id.month", 9] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    totalRevenue: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        // Đảm bảo trả về đầy đủ 12 tháng
        const fullStats = [];
        for (let i = 1; i <= 12; i++) {
            const monthStr = `${selectedYear}-${i < 10 ? "0" + i : i}`;
            const stat = stats.find(item => item.month === monthStr);
            fullStats.push({
                month: monthStr,
                totalRevenue: stat ? stat.totalRevenue : 0
            });
        }

        return {
            statusCode: 200,
            success: true,
            message: `Monthly revenue for year ${selectedYear}`,
            data: fullStats
        };
    },


    async getMonthlyOrdersAdmin(phoneNumber, role, storeId, year) {
        if (role !== ROLE.ADMIN.value)
            return { statusCode: 401, success: false, message: 'Unauthorized' };

        // Bạn có thể thêm check storeId tồn tại hoặc validate ở đây
        if (!storeId)
            return { statusCode: 400, success: false, message: 'storeId is required' };

        const selectedYear = parseInt(year) || new Date().getFullYear();

        const from = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const to = new Date(`${selectedYear}-12-31T23:59:59.999Z`);

        const stats = await Order.aggregate([
            {
                $match: {
                    store: storeId,
                    createdAt: { $gte: from, $lte: to }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: selectedYear },
                            "-",
                            {
                                $cond: [
                                    { $lte: ["$_id.month", 9] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    count: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        const fullStats = [];
        for (let i = 1; i <= 12; i++) {
            const monthStr = `${selectedYear}-${i < 10 ? "0" + i : i}`;
            const stat = stats.find(item => item.month === monthStr);
            fullStats.push({
                month: monthStr,
                count: stat ? stat.count : 0
            });
        }

        return {
            statusCode: 200,
            success: true,
            message: `Monthly order count for store ${storeId} in year ${selectedYear}`,
            data: fullStats
        };
    },



    async getMonthlyRevenueAdmin(phoneNumber, role, storeId, year) {
        if (role !== ROLE.ADMIN.value)
            return { statusCode: 401, success: false, message: 'Unauthorized' };

        if (!storeId)
            return { statusCode: 400, success: false, message: 'storeId is required' };

        const selectedYear = parseInt(year) || new Date().getFullYear();

        const from = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const to = new Date(`${selectedYear}-12-31T23:59:59.999Z`);

        const stats = await Order.aggregate([
            {
                $match: {
                    store: storeId,
                    createdAt: { $gte: from, $lte: to },
                    status: "completed" // ví dụ chỉ tính đơn hoàn thành
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: selectedYear },
                            "-",
                            {
                                $cond: [
                                    { $lte: ["$_id.month", 9] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    totalRevenue: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        const fullStats = [];
        for (let i = 1; i <= 12; i++) {
            const monthStr = `${selectedYear}-${i < 10 ? "0" + i : i}`;
            const stat = stats.find(item => item.month === monthStr);
            fullStats.push({
                month: monthStr,
                totalRevenue: stat ? stat.totalRevenue : 0
            });
        }

        return {
            statusCode: 200,
            success: true,
            message: `Monthly revenue for store ${storeId} in year ${selectedYear}`,
            data: fullStats
        };
    }




}

module.exports = statisticService