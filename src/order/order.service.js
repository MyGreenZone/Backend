const mongoose = require('mongoose')
const { OrderStatus } = require('../../constants')
const AuthMiddleWare = require('../../middleware/auth')
const Order = require('./order.schema')
const Store = require('../store/store.schema')
const Employee = require('../employee/employee.schema')
const User = require('../auth/user.schema')

const Product = require('../product/product.schema')
const Variant = require('../variant/variant.schema')
const Topping = require('../topping/topping.schema')
const Voucher = require('../voucher/voucher.schema')

const orderService = {
    async createOrder(phoneNumber, data) {

        const user = await AuthMiddleWare.authorize(phoneNumber)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        // after authen
        let newOrder = null
        if (user.roles[0] === '681c8c3c5ef65cec792c1056') {// customer create order
            newOrder = await Order.create({ ...data, owner: user._id })
        } else { // merchant create order
            const newGuest = await User.create()
            newOrder = await Order.create({ ...data, owner: newGuest._id })
        }

        return { statusCode: 201, success: true, message: 'Created order successfully', data: newOrder }
    },

    async getMyOrders(phoneNumber, status) {

        // authen
        const user = await AuthMiddleWare.authorize(phoneNumber)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        // after authen successfully
        let myOrders = []
        if (!status) {
            myOrders = await Order.find({ status: { $in: OrderStatus.getInProgressValues() }, owner: user._id })
        } else if (status === OrderStatus.COMPLETED.value) {
            myOrders = await Order.find({ status: OrderStatus.COMPLETED.value, owner: user._id })
        } else if (status === OrderStatus.CANCELLED.value) {
            myOrders = await Order.find({ status: { $in: OrderStatus.getCancelledValues() }, owner: user._id })
        }

        const responseData = await Promise.all(
            myOrders.map(async order => {
                const detail = await this.getOrderDetail(phoneNumber, order._id, false)
                console.log('detail', detail)
                return detail.data
            })
        )

        return { statusCode: 200, success: true, message: 'Get my orders successfully', data: responseData }
    },

    async getOrderDetail(phoneNumber, orderId, enableToppingItem = true) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { statusCode: 400, success: false, message: 'Invalid orderId' };
        }
        // authen
        const user = await AuthMiddleWare.authorize(phoneNumber)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        const order = await Order.findById(orderId).lean()

        if (!order) return { statusCode: 404, success: false, message: 'Order not found', data: null }

        const enrichOrder = await this.enrichOrder(order, enableToppingItem)

        return { statusCode: 200, success: true, message: 'Get order detail successfully', data: enrichOrder }
    },



    async updateOrderStatus(phoneNumber, orderId, status) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { statusCode: 400, success: false, message: 'Wrong format orderId' }
        }

        const user = await AuthMiddleWare.authorize(phoneNumber)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        // Lấy order hiện tại
        const existingOrder = await Order.findById(orderId).lean()
        if (!existingOrder) {
            return { statusCode: 404, success: false, message: 'Order not found' }
        }

        const currentOrderStatusPosition = OrderStatus.getPositionByValue(existingOrder.status)
        const newOrderStatusPosition = OrderStatus.getPositionByValue(status)
        if (currentOrderStatusPosition >= newOrderStatusPosition) {
            return {
                statusCode: 400,
                success: false,
                message: `Cannot update order status from ${existingOrder.status.toUpperCase()} to ${status.toUpperCase()}`
            }
        }

        const patchedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true, runValidators: true }
        ).lean()


        if (patchedOrder) {
            const enrichOrder = await this.enrichOrder(patchedOrder, true)
            return { statusCode: 200, success: true, message: 'Update order successfully', data: enrichOrder }
        }

    },

    async enrichOrder(order, enableToppingItem = true) {
        const responseData = { ...order }
        const [shipper, owner, creator, voucher, store] = await Promise.all([
            this.getUserInfo(Employee, String(order.shipper)),
            this.getUserInfo(User, String(order.owner)),
            this.getUserInfo(Employee, String(order.creator)),
            this.getVoucherInfo(Voucher, String(order.voucher)),
            this.getStoreInfo(Store, String(order.store)),
        ])

        responseData.shipper = shipper
        responseData.owner = owner
        responseData.creator = creator
        responseData.voucher = voucher
        responseData.store = store

        responseData.orderItems = await Promise.all(
            (order.orderItems || []).map(async orderItem => {
                return await this.getOrderItemInfo(orderItem, enableToppingItem)
            })
        )
        return responseData
    },

    async getOrderItemInfo(orderItem, enableToppingItem = true) {
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

        let toppingItems = orderItem.toppingItems
        if (enableToppingItem) {
            toppingItems = await Promise.all(
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

        }

        return {
            product: {
                _id: variant._id,
                name: product.name,
                size: variant.size,
                image: product.image,
                sellingPrice: variant.sellingPrice
            },
            quantity: orderItem.quantity,
            price: orderItem.price,
            toppingItems: enableToppingItem ? toppingItems : toppingItems.length
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