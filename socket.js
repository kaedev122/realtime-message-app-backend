const User = require("./Models/User.js");
const Message = require("./Models/Message.js");
const Conversation = require("./Models/Conversation.js");
const Promise = require('bluebird');

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

    const getAllUserIdOnline = () => {
        const result = users.map(user => {
            return user.userId
        })
        return result
    }

    const getAllConversationOfUser = async (userId) => {
        try {
            const conversation = await Conversation.find({
                members: { $in: [userId.toString()] },
            }).select("_id");
            // const result = conversation.map(item => {
            //     return item._id
            // })
            return conversation;
        } catch (err) {
            console.log(err);
        }
    }
    
    io.on("connection", async (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        socket.on("addUser", async userId => {
            addUser(userId, socket.id)
            io.emit("getUsersOnline", getAllUserIdOnline())
            let conversationList = await getAllConversationOfUser(userId)
            conversationList.map()
        })

        
        socket.join

        // const userId = await getUserIdBySocket(socket)

        // socket.on("sendMessage", ({ _id, conversationId, createdAt, image, text, sender, members }) => {
        //     io.emit("getMessage", {
        //         _id: _id,
        //         conversationId: conversationId,
        //         createdAt: createdAt,
        //         image: image,
        //         text: text,
        //         sender: sender
        //     });
        //     console.log(sender)
        // });

        socket.on('forceDisconnect', () => {
            socket.disconnect();
            removeUser(socket.id)
            io.emit("getUsersOnline", getAllUserIdOnline())
        });

        socket.on("disconnect", () => {
            console.log(`❌: ${socket.id} user just disconnected!`)
            removeUser(socket.id)
            io.emit("getUsersOnline", getAllUserIdOnline())
        })
    });
};