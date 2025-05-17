const mongoose = require('mongoose')
const Order = require('./order.schema')
const Store = require('../store/store.schema')
const Employee = require('../employee/employee.schema')
const User = require('../auth/user.schema')

const Product = require('../product/product.schema')
const Variant = require('../variant/variant.schema')
const Topping = require('../topping/topping.schema')
const Voucher = require('../voucher/voucher.schema')

const orderService = {
    async createOrder(data) {
        const newOrder = await Order.create(data)
        return { statusCode: 201, success: true, message: 'Created order successfully', data: newOrder }
    },

    async getMyOrders(userId, status) {
        const myOrders = await Order.find({ status, owner: userId })
        return { statusCode: 200, success: true, message: 'Get my orders successfully', data: myOrders }
    },

    async getOrderDetail(orderId) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { statusCode: 400, success: false, message: 'Invalid orderId' };
        }

        const order = await Order.findById(orderId).lean()

        if (!order) {
            return { statusCode: 404, success: false, message: 'Order not found', data: null }
        }

        // clone order
        const responseData = { ...order }


        responseData.shipper = await this.getUserInfo(Employee, String(order.shipper))
        responseData.owner = await this.getUserInfo(User, String(order.owner))
        responseData.creator = await this.getUserInfo(Employee, String(order.creator))

        responseData.voucher = await this.getVoucherInfo(Voucher, String(order.voucher))

        responseData.store = await this.getStoreInfo(Store, String(order.store))

        responseData.orderItems = await Promise.all(
            (order.orderItems || []).map(async orderItem => {
                return await this.getOrderItemInfo(orderItem)
            })
        )

        return { statusCode: 200, success: true, message: 'Get order detail successfully', data: responseData }
    },

    async getOrderItemInfo(orderItem) {
        if (!mongoose.Types.ObjectId.isValid(orderItem.variant)) {
            return this.fallbackOrderItem(orderItem)
        }
        const variant = await Variant.findById(orderItem.variant).lean()
        if (!variant) return this.fallbackOrderItem(orderItem)

        if (!mongoose.Types.ObjectId.isValid(variant.productId)) {
            return this.fallbackOrderItem(orderItem)
        }
        const product = await Product.findById(variant.productId)
        if (!product) return this.fallbackOrderItem(orderItem)

        const toppingItems = await Promise.all(
            orderItem.toppingItems.map(async topping => {
                const toppingDetail = await Topping.findById(topping.topping)
                if (toppingDetail) {
                    return {
                        _id: toppingDetail._id,
                        name: toppingDetail.name,
                        extraPrice: toppingDetail.extraPrice,
                        quantity: topping.quantity,
                        price: topping.price
                    }
                }
                return null
            })
        )
        return {
            product: {
                _id: product._id,
                name: product.name,
                size: product.size,
                image: product.image,
                sellingPrice: product.sellingPrice
            },
            quantity: orderItem.quantity,
            price: orderItem.price,
            toppingItems: toppingItems || []
        }
    },

    fallbackOrderItem(orderItem) {
        return {
            product: null,
            quantity: orderItem.quantity,
            price: orderItem.price,
            toppingItems: orderItem.toppingItems || []
        }
    },


    async getStoreInfo(Model, id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const storeInfo = await Model.findById(id).lean()
            if (storeInfo) {
                // console.log('storeInfo', JSON.stringify(storeInfo, null, 2))
                return {
                    name: storeInfo.name,
                    phoneNumber: storeInfo.phoneNumber,
                    address: storeInfo.address,
                    latitude: storeInfo.latitude,
                    longitude: storeInfo.longitude
                }
            }
            return null
        }
        return null
    },


    async getVoucherInfo(Model, id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const voucherInfo = await Model.findById(id).lean()
            if (voucherInfo) {
                // console.log('voucherInfo', JSON.stringify(voucherInfo, null, 2))
                return {
                    name: voucherInfo.name,
                    code: voucherInfo.code,
                    voucherType: voucherInfo.voucherType,
                    discountType: voucherInfo.discountType,
                    value: voucherInfo.value
                }
            }
            return null

        }
        return null
    },

    async getUserInfo(Model, id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const userInfo = await Model.findById(id).lean()
            if (userInfo) {
                // console.log('userInfo', JSON.stringify(userInfo, null, 2))
                return {
                    phoneNumber: userInfo.phoneNumber,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    avatar: userInfo.avatar || null
                }
            }
            return null
        }
        return null
    }



}

module.exports = orderService