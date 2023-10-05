const Message = require("../Models/Message.js");

module.exports.createMessage = async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getAllMessageFromConversation = async (req, res) => {
    console.log(req.params.conversationId)
    const messages = await Message.find({
        conversationId: req.params.conversationId,
    });
    console.log("///////////////////////////////////", messages)
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        console.log("///////////////////////////////////", messages)
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
};