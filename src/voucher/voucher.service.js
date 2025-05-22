const Voucher = require('./voucher.schema')
const UserVoucher = require('../userVoucher/userVoucher.schema')
const AuthMiddleWare = require('../../middleware/auth')
const { ROLE } = require('../../constants')
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
    },

    async exchangeSeed({ voucherId, phoneNumber, role }) {

        if (role !== ROLE.CUSTOMER.value) return { statusCode: 401, success: false, message: 'Unauthorized' }
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }


        const voucher = await Voucher.findById(voucherId).lean()
        if (!voucher) return { statusCode: 404, success: false, message: 'Voucher not found' }
        const isExpired = voucher.endDate < new Date();
        const isInactive = voucher.status === 'inactive';
        if (isExpired || isInactive) {
            return { statusCode: 400, success: false, message: 'Voucher is inactive or expired' };
        }

        if (voucher.voucherType !== 'seed') {
            return { statusCode: 400, success: false, message: 'Voucher is not exchangeable with seed' };
        }

        // check xem co record chua
        const alreadyOwned = await UserVoucher.findOne({
            userId: user._id,
            voucherId,
            used: false
        })
        if (alreadyOwned) {
            return { statusCode: 400, success: false, message: 'Bạn đã có voucher này rồi. Hãy dùng trước khi đổi thêm nhé!' };
        }

        if (user.seed < voucher.requiredPoints) {
            return { statusCode: 400, success: false, message: 'Not enough seed' };
        }

        user.seed -= voucher.requiredPoints
        await user.save()

        await UserVoucher.create({
            userId: user._id,
            voucherId: voucher._id,
            code: voucher.code,
            exchangedAt: new Date()
        })
        return { statusCode: 200, success: true, message: 'Exchange voucher successfully' }
    },

    async getMyVouchers(phoneNumber, role) {
        if (role !== ROLE.CUSTOMER.value) return { statusCode: 401, success: false, message: 'Unauthorized' }
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }
        const myVouchers = await UserVoucher.find({ userId: user._id, used: false })
        return { statusCode: 200, success: true, message: 'Get my vouchers successfully', data: myVouchers }
    }









}

module.exports = voucherService