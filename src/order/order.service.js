const mongoose = require('mongoose')
const { OrderStatus, DeliveryMethod } = require('../../constants')
const AuthMiddleWare = require('../../middleware/auth')
const deliveryService = require('../delivery/delivery.service')
const { toVietnamTime } = require('../../utils/timeUtils')
const Order = require('./order.schema')
const Store = require('../store/store.schema')
const Employee = require('../employee/employee.schema')
const User = require('../auth/user.schema')
const { ROLE } = require('../../constants')
const Product = require('../product/product.schema')
const Variant = require('../variant/variant.schema')
const Topping = require('../topping/topping.schema')
const Voucher = require('../voucher/voucher.schema')
const UserVoucher = require('../userVoucher/userVoucher.schema')

const orderService = {
    // main services
    async createOrder(phoneNumber, role, requestBody) {
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        // after authen
        const store = await Store.findById(requestBody.store)
        if (!store) return { statusCode: 404, success: false, message: 'Create order failed. Store not found' }


        const result = await this.validateVoucher(requestBody.voucher, user._id);
        if (!result.success) return result;

        const exchangeableVoucher = result.exchangeableVoucher

        // pass hết thì tạo order
        const newOrder = await this.setupOrder(user, role, requestBody);

        if (newOrder && exchangeableVoucher) {
            exchangeableVoucher.used = true
            exchangeableVoucher.usedAt = new Date()
            await exchangeableVoucher.save()
        }
        return { statusCode: 201, success: true, message: 'Created order successfully', data: newOrder }
    },

    async getMyOrders(phoneNumber, role, status) {

        // authen
        if (role !== ROLE.CUSTOMER.value) return { statusCode: 401, success: false, message: 'Unauthorized' }
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
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

    async getOrderDetail(phoneNumber, role, orderId, enableToppingItem = true) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { statusCode: 400, success: false, message: 'Invalid orderId' };
        }
        // authen
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        const order = await Order.findById(orderId).lean()

        if (!order) return { statusCode: 404, success: false, message: 'Order not found', data: null }

        const enrichOrder = await this.enrichOrder(order, enableToppingItem)

        const responseData = this.formatTimelines(enrichOrder)

        return { statusCode: 200, success: true, message: 'Get order detail successfully', data: responseData }
    },

    async updatePaymentStatus(phoneNumber, role, orderId, requestBody) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { statusCode: 400, success: false, message: 'Wrong format orderId' }
        }

        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        const existingOrder = await Order.findById(orderId).lean()
        if (!existingOrder) return { statusCode: 404, success: false, message: 'Order not found' }


        if (existingOrder.status !== OrderStatus.AWAITING_PAYMENT.value) {
            return {
                statusCode: 400,
                success: false,
                message: 'Cannot update payment status when order status is different from awaitingPayment'
            }
        }

        if (existingOrder.paymentMethod === 'cod') {
            return { statusCode: 400, success: false, message: 'Cannot update payment status with COD payment' }
        }

        const patchedData = requestBody.paymentStatus === 'success' ?
            {
                ...requestBody,
                status: OrderStatus.PENDING_CONFIRMATION.value,
                pendingConfirmationAt: new Date()
            } :
            { ...requestBody }


        const patchedOrder = await Order.findByIdAndUpdate(
            orderId,
            patchedData,
            { new: true, runValidators: true }
        ).lean()



        if (patchedOrder) {


            const enrichOrder = await this.enrichOrder(patchedOrder, true)

            return { statusCode: 200, success: true, message: 'Update order successfully', data: enrichOrder }
        }
        return { statusCode: 500, success: false, message: 'Failed to update order' }
    },


    async updateOrderStatus(phoneNumber, role, orderId, requestBody) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { statusCode: 400, success: false, message: 'Wrong format orderId' }
        }

        if (role === ROLE.CUSTOMER.value && requestBody.status !== OrderStatus.CANCELLED.value)
            return { statusCode: 401, success: false, message: 'Unauthorized' }
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return { statusCode: 401, success: false, message: 'Unauthorized' }

        const order = await Order.findById(orderId).lean()
        if (user.workingStore.toString() !== order.store.toString())
            return {
                statusCode: 401,
                success: false,
                message: 'Unauthorized. Nhân viên không có quyền update đơn hàng của chi nhánh khác'
            }

        const invalidStatusFlow = await this.validateStatusFlow(orderId, requestBody.status, requestBody)
        if (invalidStatusFlow) return invalidStatusFlow

        const patchedData = this.extractPatchedData(requestBody)

        const patchedOrder = await Order.findByIdAndUpdate(orderId, patchedData, { new: true, runValidators: true }).lean()


        if (patchedOrder) {
            // console.log(['patchedOrder', JSON.stringify(patchedOrder, null, 2)])
            // update user's seed if newStatus = 'completed'
            if (requestBody.status === OrderStatus.COMPLETED.value) {
                const earnedSeed = Math.round(patchedOrder.totalPrice * 0.0001)

                const promises = [
                    User.findByIdAndUpdate(
                        patchedOrder.owner,
                        { $inc: { seed: earnedSeed } },
                        { new: true }
                    )
                ];


                if (patchedOrder.deliveryMethod === DeliveryMethod.DELIVERY.value) {
                    promises.push(
                        deliveryService.completeDelivery({ employee: patchedOrder.shipper, order: orderId })
                    );
                }

                await Promise.all(promises);


            } else if (requestBody.status === OrderStatus.READY_FOR_PICKUP.value &&
                patchedOrder.deliveryMethod === DeliveryMethod.DELIVERY.value
            ) {
                const assignResult = await deliveryService.assignDelivery({ employee: requestBody.shipper, order: patchedOrder })
                if (!assignResult.success) return assignResult
            }

            const enrichOrder = await this.enrichOrder(patchedOrder, true)
            return { statusCode: 200, success: true, message: 'Update order successfully', data: enrichOrder }
        }
        return { statusCode: 500, success: false, message: 'Failed to update order' }
    },

    // support functions

    async setupOrder(user, role, requestBody) {
        const status = requestBody.paymentMethod === 'online'
            ? OrderStatus.AWAITING_PAYMENT.value
            : OrderStatus.PENDING_CONFIRMATION.value;

        const pendingConfirmationAt = requestBody.paymentMethod === 'cod' ? new Date() : null

        const isCustomer = role === ROLE.CUSTOMER.value

        if (isCustomer) {
            return await Order.create({ ...requestBody, status, pendingConfirmationAt, owner: user._id });
        } else {
            const newGuest = await User.create({ lastName: 'Khách vãng lai' });
            if (newGuest) console.log('newGuest', newGuest)
            return await Order.create({ ...requestBody, status, pendingConfirmationAt, owner: newGuest._id });
        }
    },

    async checkStoreExists(storeId) {
        const store = await Store.findById(storeId);
        if (!store) {
            return {
                statusCode: 404,
                success: false,
                message: 'Tạo đơn thất bại. Store không tồn tại'
            };
        }
        return null
    },


    async validateVoucher(voucherId, userId) {
        if (voucherId) {
            const voucher = await Voucher.findById(voucherId)
            if (!voucher) return { statusCode: 404, success: false, message: 'Create order failed. Voucher not found' }

            const isExpired = voucher.endDate < new Date();
            const isInactive = voucher.status === 'inactive';

            // Kiểm tra voucher hết hạn hoặc không hoạt động trước
            if (isExpired || isInactive) {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Tạo đơn thất bại. Voucher is inactive or expired'
                };
            }

            if (voucher.voucherType === 'seed') {
                const exchangeableVoucher = await UserVoucher.findOne({
                    userId,
                    voucherId: voucher._id,
                    used: false
                }).populate('voucherId');

                if (!exchangeableVoucher) {
                    return {
                        statusCode: 400,
                        success: false,
                        message: 'Tạo đơn thất bại. Khách hàng chưa đổi voucher này. Không thể sử dụng'
                    };
                }

                return { success: true, exchangeableVoucher };
            }
        }


        // Trường hợp voucher global hoặc các loại khác không cần thêm xử lý
        return { success: true };
    },


    extractPatchedData(requestBody) {
        switch (requestBody.status) {
            case OrderStatus.READY_FOR_PICKUP.value: {
                return {
                    status: requestBody.status,
                    readyForPickupAt: new Date()
                }
            }
            case OrderStatus.SHIPPING_ORDER.value: {
                return {
                    status: requestBody.status,
                    shippingOrderAt: new Date()
                }
            }
            case OrderStatus.COMPLETED.value: {
                return {
                    status: requestBody.status,
                    shipper: requestBody.shipper,
                    completedAt: new Date()
                }
            }
            case OrderStatus.CANCELLED.value:
            case OrderStatus.FAILED_DELIVERY.value: {
                return {
                    status: requestBody.status,
                    shipper: requestBody.shipper,
                    cancelReason: requestBody.cancelReason,
                    cancelledAt: new Date()
                }
            }

            default: {
                return { status: requestBody.status }
            }
        }
    },

    async validateStatusFlow(orderId, newStatus, requestBody) {
        // Lấy order hiện tại
        const existingOrder = await Order.findById(orderId).lean()
        if (!existingOrder) {
            return { statusCode: 404, success: false, message: 'Order not found' }
        }

        if (requestBody.status === OrderStatus.READY_FOR_PICKUP.value &&
            existingOrder.deliveryMethod === DeliveryMethod.PICK_UP.value &&
            'shipper' in requestBody
        ) {
            return {
                statusCode: 400,
                success: false,
                message: `Không truyền shipper cho đơn pickup`
            }
        }

        if (requestBody.status === OrderStatus.SHIPPING_ORDER.value &&
            existingOrder.deliveryMethod === DeliveryMethod.PICK_UP.value
        ) {
            return {
                statusCode: 400,
                success: false,
                message: `Cannot update a pickup order to ${newStatus.toUpperCase()}`
            }
        }



        const currentOrderStatusPosition = OrderStatus.getPositionByValue(existingOrder.status)

        const newOrderStatusPosition = OrderStatus.getPositionByValue(newStatus)


        if ([0, 1].includes(currentOrderStatusPosition) && newStatus === OrderStatus.CANCELLED.value) return null

        if (currentOrderStatusPosition === 3 &&
            newOrderStatusPosition == 5 &&
            existingOrder.deliveryMethod === DeliveryMethod.PICK_UP.value) {
            return null
        }

        if (currentOrderStatusPosition >= newOrderStatusPosition ||
            newOrderStatusPosition != currentOrderStatusPosition + 1
        ) {
            return {
                statusCode: 400,
                success: false,
                message: `Cannot update order status from ${existingOrder.status.toUpperCase()} to ${newStatus.toUpperCase()}`
            }
        }

        if (existingOrder.status === OrderStatus.PROCESSING.value &&
            newStatus === OrderStatus.READY_FOR_PICKUP.value &&
            existingOrder.deliveryMethod === DeliveryMethod.DELIVERY.value
        ) {
            const shipper = await Employee.findById(requestBody.shipper)
            if (!shipper) return { statusCode: 404, success: false, message: 'Cannot update. Shipper not found' }
        }


        return null
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

    formatTimelines(order) {
        return {
            ...order,
            createdAt: toVietnamTime(order.createdAt),
            updatedAt: toVietnamTime(order.updatedAt),
            fulfillmentDateTime: toVietnamTime(order.fulfillmentDateTime),
            completedAt: toVietnamTime(order.completedAt),
            pendingConfirmationAt: toVietnamTime(order.pendingConfirmationAt),
            readyForPickupAt: toVietnamTime(order.readyForPickupAt),
            shippingOrderAt: toVietnamTime(order.shippingOrderAt),
            cancelledAt: toVietnamTime(order.cancelledAt)
        };
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