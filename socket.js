module.exports = async function connectSocket(http) {
    const io = require('socket.io')(http, {
        cors: {
            origin: "*"
        }
    });
    
    let users = []
    
    const addUser = (userId, socketId) => {
        !users.some(user => user.userId === userId ) && users.push({userId, socketId})
    }
    
    const removeUser = (socketId) => {
        users = users.filter(user => user.socketId !== socketId)
    }
    
    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("addUser", userId => {
            addUser(userId, socket.id)
            io.emit("getUsers", users)
        })
    
        socket.on("disconnect", () => {
            console.log(`❌: ${socket.id} user just disconnected!`)
            removeUser(socket.id)
            io.emit("getUsers", users)
        })
    });
};