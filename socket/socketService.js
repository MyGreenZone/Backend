// socket/socketService.js
const orderHandler = require('./handlers/orderHandler')
const employeeHandler = require('./handlers/employeeHandler')
const userHandler = require('./handlers/userHandler')

const userSocketMap = new Map();
const socketService = (io) => {
    io.on('connection', (socket) => {
        const { user } = socket.data
        const userId = user._id.toString()
        userSocketMap.set(userId, socket.id);

        orderHandler(io, socket)
        employeeHandler(io, socket)
        userHandler(io, socket)


        socket.on('disconnect', () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
            userSocketMap.delete(userId.toString());
        })
    })
}

module.exports = { socketService, userSocketMap }