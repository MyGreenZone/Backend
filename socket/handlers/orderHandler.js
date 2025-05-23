const EVENT_NAME = require('../socket.eventName')

const orderHandler = (io, socket) => {
    /**
    * ORDER_ASSIGNED
    * Khi nhân viên chọn người giao hàng
    */
    socket.on(EVENT_NAME.ORDER_ASSIGNED, ({ employeeId, orderId }) => {
        io.to(orderId).emit(EVENT_NAME.ORDER_ASSIGNED, { employeeId, orderId })
        console.log(`🚚 Order ${orderId} assigned to employee ${employeeId}`);
    })


    /**
     * ORDER_UPDATE_STATUS
     * Khi nhân viên thay đổi trạng thái đơn hàng.
     * Emit tới cả user (room orderId) và nhân viên khác trong cùng store (room storeId).
    */
    socket.on(EVENT_NAME.ORDER_UPDATE_STATUS, ({ storeId, orderId, newStatus }) => {
        io.to(orderId).emit(EVENT_NAME.ORDER_UPDATE_STATUS, { orderId, status: newStatus })
        io.to(storeId).emit(EVENT_NAME.ORDER_UPDATE_STATUS, { orderId, status: newStatus })
        console.log(`📦 Order ${orderId} status updated to ${newStatus}`);
    })
}

module.exports = orderHandler