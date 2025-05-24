const { OrderStatus } = require('../../constants');
const EVENT_NAME = require('../socket.eventName')
const Employee = require('../../src/employee/employee.schema')
const orderHandler = (io, socket) => {

    socket.on(EVENT_NAME.ORDER_NEW, (data) => {
        io.to(data.storeId).emit(EVENT_NAME.ORDER_NEW, data)
        console.log(`📦 New order ${data.orderId} to store ${data.storeId}`);
    })
    /**
    * ORDER_ASSIGNED
    * Khi nhân viên chọn người giao hàng
    */
    socket.on(EVENT_NAME.ORDER_ASSIGNED, async (data) => {
        const { orderId, assignedTo, storeId } = data
        try {

            const employee = await Employee.findById(assignedTo).select('firstName lastName');

            if (!employee) {
                console.log(`Socket. Employee not found`);
                return;
            }

            io.to(storeId).emit(EVENT_NAME.ORDER_ASSIGNED, {
                ...data,
                message: `Đơn hàng ${orderId} vừa được giao cho nhân viên ${employee.firstName} ${employee.lastName}`
            })
            io.to(orderId).emit(EVENT_NAME.ORDER_ASSIGNED, {
                ...data,
                message: `Đơn hàng ${orderId} vừa được giao cho nhân viên ${employee.firstName} ${employee.lastName}`
            })
            console.log(`🚚 Order ${orderId} assigned to employee ${assignedTo}`);
        } catch (error) {
            console.error('Socket. Error when get order', err);
        }

    })


    /**
     * ORDER_UPDATE_STATUS
     * Khi nhân viên thay đổi trạng thái đơn hàng.
     * Emit tới cả user (room orderId) và nhân viên khác trong cùng store (room storeId).
    */
    socket.on(EVENT_NAME.ORDER_UPDATE_STATUS, (data) => {
        const { storeId, orderId, status } = data
        io.to(orderId).emit(EVENT_NAME.ORDER_UPDATE_STATUS, data)
        io.to(storeId).emit(EVENT_NAME.ORDER_UPDATE_STATUS, data)

        console.log(`📦 Order ${orderId} status updated to ${status}`);


        if ([OrderStatus.COMPLETED.value, OrderStatus.CANCELLED.value, OrderStatus.FAILED_DELIVERY.value].includes(status)) {
            io.to(orderId).emit(EVENT_NAME.EMPLOYEE_LEAVE_ORDER, { orderId })
            io.to(orderId).emit(EVENT_NAME.USER_LEAVE_ORDER, { orderId })

            console.log('leave order')
        }
    })
}

module.exports = orderHandler