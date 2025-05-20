const voucherService = require('./voucher.service')
const voucherValidator = require('./voucher.validator')
const mongoose = require('mongoose')
const voucherController = {
    async createVoucher(req, res) {
        const { value, error } = voucherValidator.validate(req.body, { abortEarly: false, convert: true })

        if (error) {
            const errors = error.details.map(err => {
                return { message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, errors })
        }

        try {
            const result = await voucherService.createVoucher(value);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error creating voucher:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi tạo voucher',
            });
        }
    },

    async getAllVouchers(req, res) {
        try {
            const result = await voucherService.getAllVouchers();
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error get all vouchers", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get all vouchers',
            });
        }
    },

    async getVoucherDetail(req, res) {
        try {
            const result = await voucherService.getAllVouchers();
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error get all vouchers", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get all vouchers',
            });
        }
    },

    async updateVoucher(req, res) {
        const { voucherId } = req.params
        if (!mongoose.Types.ObjectId.isValid(voucherId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Wrong format voucherId' })
        }


        const { value, error } = voucherValidator.validate(req.body, { abortEarly: false, convert: true })

        if (error) {
            const errors = error.details.map(err => {
                return { message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, errors })
        }

        try {
            const result = await voucherService.updateVoucher(voucherId, value);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error update voucher:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error update voucher',
            });
        }
    },

    async exchangeSeed(req, res) {
        const { voucherId } = req.params
        if (!voucherId) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Missing voucherId' })
        }
        if (!mongoose.Types.ObjectId.isValid(voucherId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Wrong format voucherId' })
        }

        try {
            const phoneNumber = req.user.phoneNumber
            const result = await voucherService.exchangeSeed({voucherId, phoneNumber});
            return res.status(result.statusCode).json(result);

        } catch (error) {
            console.log("Error exchange voucher:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi exchange voucher',
            });
        }
    }
}

module.exports = voucherController