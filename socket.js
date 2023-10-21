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

    const getUser = (userId) => {
        return users.find((user) => user.userId === userId);
    };
    
    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        socket.on("addUser", userId => {
            addUser(userId, socket.id)
            io.emit("getUsers", users)
        })

        socket.on("sendMessage", ({ _id, conversationId, createdAt, image, sender, members }) => {
            const mems = members.map(member => {
                return member._id
            })
            const usersGetMessage = mems.map(mem => {
                console.log("mem", mem)
                const memSocket = getUser(mem)
                console.log("memSocket", memSocket)
                return memSocket?.socketId
            });

            io.to(usersGetMessage).emit("getMessage", {
                _id: _id,
                conversationId: conversationId,
                createdAt: createdAt,
                image: image,
                sender: sender
            });
        });

        socket.on("disconnect", () => {
            console.log(`❌: ${socket.id} user just disconnected!`)
            removeUser(socket.id)
            io.emit("getUsers", users)
        })
    });
};