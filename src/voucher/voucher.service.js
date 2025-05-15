const Voucher = require('./voucher.schema')
const voucherValidator = require('./voucher.validator')
const voucherService = {
    async createVoucher(data) {
        const { code } = data
        const existing = await Voucher.findOne({ code })
        if (existing) {
            return { statusCode: 400, success: false, message: 'This voucher code has been existed' }
        }

        const newVoucher = await Voucher.create(data)
        return { statusCode: 201, success: true, message: 'Created voucher successfully', data: newVoucher }

    },

    async getAllVouchers() {
        const vouchers = await Voucher.find({ status: 'active' })
        return { statusCode: 200, success: true, message: 'Get all vouchers successfully', data: vouchers }
    },

    async getVoucherDetail(voucherId) {
        const detail = await Voucher.findById(voucherId)
        if (!detail) {
            return { statusCode: 404, success: false, message: 'Voucher not found' }
        }
        return { statusCode: 200, success: true, message: 'Get voucher detail successfully', data: detail }
    },


    async updateVoucher(voucherId, data) {
        const { code } = data;

        // Kiểm tra nếu code đã tồn tại ở voucher khác
        const existing = await Voucher.findOne({ code, _id: { $ne: voucherId } });
        if (existing) {
            return {
                statusCode: 400,
                success: false,
                message: 'This voucher code has already existed'
            };
        }

        const updatedVoucher = await Voucher.findByIdAndUpdate(voucherId, data, { new: true });

        return {
            statusCode: 200,
            success: true,
            message: 'Updated voucher successfully',
            data: updatedVoucher
        };
    }









}

module.exports = voucherService