const Order = require('./order.schema')
const mongoose = require('mongoose')
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


        const orderDetail = await Order.findById(orderId).lean()
        if (!orderDetail) {
            return { statusCode: 404, success: false, message: 'Order not found', data: null }
        }

        const { owner, voucher, shipper, creator, store, orderItems } = orderDetail


        if (orderItems.length > 0) {

            const orderItemsData = await Promise.all(
                orderItems.map(async orderItem => {
           
                    const variant = await Variant.findById(orderItem.variant).lean()
                    if (!variant) return {
                        product: null,
                        quantity: orderItem.quantity,
                        price: orderItem.price,
                        toppingItems: orderItem.toppingItems
                    }
                    // console.log('variant detail', JSON.stringify(variant, null, 2))

                    const product = await Product.findById(variant.productId)
                    if (!product) return {
                        product: null,
                        quantity: orderItem.quantity,
                        price: orderItem.price,
                        toppingItems: orderItem.toppingItems
                    }
                    // console.log('product detail', JSON.stringify(product, null, 2))


                    if (orderItem.toppingItems.length > 0) {
                        // console.log(orderItem.toppingItems)
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
                            })
                        )
                        // console.log('toppingItems', toppingItems)
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
                            toppingItems: toppingItems
                        }

                    }

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
                        toppingItems: []
                    }
                })
            )

            orderDetail.orderItems = orderItemsData

        }


        if (shipper) {
            const shipperDetail = await Employee.findById(shipper).lean()
            if (shipperDetail) {
                // console.log('shipperDetail', JSON.stringify(shipperDetail, null, 2))
                orderDetail.creator = {
                    phoneNumber: shipperDetail.phoneNumber,
                    firstName: shipperDetail.firstName,
                    lastName: shipperDetail.lastName,
                    avatar: shipperDetail.avatar || null
                }
            }
        }

        if (owner) {
            const ownerDetail = await User.findById(owner).lean()
            if (ownerDetail) {
                // console.log('ownerDetail', JSON.stringify(ownerDetail, null, 2))
                orderDetail.owner = {
                    phoneNumber: ownerDetail.phoneNumber,
                    firstName: ownerDetail.firstName,
                    lastName: ownerDetail.lastName,
                    avatar: ownerDetail.avatar || null
                }
            }

        }


        if (voucher) {
            const voucherDetail = await Voucher.findById(voucher).lean()
            if (voucherDetail) {
                // console.log('voucherDetail', JSON.stringify(voucherDetail, null, 2))
                orderDetail.voucher = {
                    name: voucherDetail.name,
                    code: voucherDetail.code,
                    voucherType: voucherDetail.voucherType,
                    discountType: voucherDetail.discountType,
                    value: voucherDetail.value
                }
            }

        }

        if (store) {
            const storeDetail = await Store.findById(store).lean()
            if (storeDetail) {
                // console.log('storeDetail', JSON.stringify(storeDetail, null, 2))
                orderDetail.store = {
                    name: storeDetail.name,
                    phoneNumber: storeDetail.phoneNumber,
                    address: storeDetail.address,
                    latitude: storeDetail.latitude,
                    longitude: storeDetail.longitude
                }
            }
        }

        if (creator) {
            const creatorDetail = await Employee.findById(creator).lean()
            if (creatorDetail) {
                // console.log('creatorDetail', JSON.stringify(creatorDetail, null, 2))
                orderDetail.creator = {
                    phoneNumber: creatorDetail.phoneNumber,
                    firstName: creatorDetail.firstName,
                    lastName: creatorDetail.lastName,
                    avatar: creatorDetail.avatar || null
                }
            }
        }



        return { statusCode: 200, success: true, message: 'Get order detail successfully', data: orderDetail }
    }

}

module.exports = orderService