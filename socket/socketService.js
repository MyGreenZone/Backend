// socket/socketService.js
const orderHandler = require('./handlers/orderHandler')
const employeeHandler = require('./handlers/employeeHandler')
const userHandler = require('./handlers/userHandler')


const socketService = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 New socket connected: ${socket.id}`);

        // register handlers

        orderHandler(io, socket)
        employeeHandler(io, socket)
        userHandler(io, socket)


        socket.on('disconnect', () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        })
    })
}

module.exports = socketService