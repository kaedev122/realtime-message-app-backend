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

        socket.on("sendMessage", ({ _id, conversationId, createdAt, image, text, sender, members }) => {
            console.log("members", members)
            
            const mems = members.map(member => {
                return member._id
            })

            console.log("mems", mems)

            const usersGetMessage = mems.map(mem => {
                const memSocket = getUser(mem)
                return memSocket?.socketId
            });

            console.log("usersGetMessage", usersGetMessage)

            io.emit("getMessage", {
                _id: _id,
                conversationId: conversationId,
                createdAt: createdAt,
                image: image,
                text: text,
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