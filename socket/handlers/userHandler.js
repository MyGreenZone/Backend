const EVENT_NAME = require('../socket.eventName')
const Order = require('../../src/order/order.schema')
const { formatVietnamDatetime } = require('../../utils/timeUtils')
const userHandler = (io, socket) => {
    const { user, phoneNumber, role } = socket.data

    socket.on(EVENT_NAME.USER_JOIN_ORDER, async (data) => {
        const { orderId, userId, storeId } = data
        socket.join(orderId)
        try {
            // 🔍 Truy vấn order từ DB
            const order = await Order.findById(orderId).select('fulfillmentDateTime');

            if (!order) {
                console.log(`Socket. Order not found`);
                return;
            }

            // 🕒 Định dạng thời gian (tuỳ cách bạn muốn hiển thị)
            const formattedTime = formatVietnamDatetime(order.fulfillmentDateTime)

            // 📢 Gửi tới store room
            io.to(storeId).emit(EVENT_NAME.ORDER_NEW, {
                orderId,
                storeId,
                title: 'Đơn hàng mới',
                message: `Đơn hàng mới ${orderId} cần hoàn thành trước ${formattedTime}`
            });
        } catch (err) {
            console.error('Socket. Error when get order', err);
        }
    })


    socket.on(EVENT_NAME.USER_LEAVE_ORDER, ({ userId, orderId }) => {
        socket.leave(orderId)
        console.log(`${userId} left order room: ${orderId}`)
    })

}

module.exports = userHandler