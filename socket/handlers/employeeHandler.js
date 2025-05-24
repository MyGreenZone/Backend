const EVENT_NAME = require('../socket.eventName')



const employeeHandler = (io, socket) => {

    /**
    * EMPLOYEE_JOIN_STORE
    * Khi employee login thì join room tương ứng với cửa hàng
    */
    socket.on(EVENT_NAME.EMPLOYEE_JOIN_STORE, ({ employeeId, storeId }) => {
        socket.join(storeId)
        console.log(`${employeeId} joined store room: ${storeId}`)
    })


   /**
    * EMPLOYEE_JOIN_ORDER
    * Khi employee được phân công giao hàng
    */
    socket.on(EVENT_NAME.EMPLOYEE_JOIN_ORDER, ({ employeeId, orderId }) => {
        socket.join(orderId)
        console.log(`${employeeId} joined order room: ${orderId}`)
    })



    /**
    * EMPLOYEE_LEAVE_ORDER
    * Khi đơn hoàn thành hoặc bị hủy, employee thoát khỏi room order
    */
    socket.on(EVENT_NAME.EMPLOYEE_LEAVE_ORDER, (data) => {
        const {orderId} = data
        socket.leave(orderId)
        console.log(`Delivery employee left order room: ${orderId}`)
    })
}
module.exports = employeeHandler