const EVENT_NAME = require('../socket.eventName')
// USER_JOIN_ORDER: 'user.joinOrder',
// USER_LEAVE_ORDER: 'user.leaveOrder',
const userHandler = (io, socket) => {
    socket.on(EVENT_NAME.USER_JOIN_ORDER, (userId, orderId) => {
        socket.join(orderId)
        console.log(`${userId} joined order room: ${orderId}`)
    })


    socket.on(EVENT_NAME.USER_LEAVE_ORDER, (userId, orderId) => {
        socket.leave(orderId)
        console.log(`${userId} left order room: ${orderId}`)
    })

}

module.exports = userHandler