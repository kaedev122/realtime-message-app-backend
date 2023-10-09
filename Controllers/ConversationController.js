const User = require("../Models/User.js");
const Conversation = require("../Models/Conversation.js");
const Promise = require('bluebird');

module.exports.createConversation =  async (req, res) => {
    const sender = req.body.senderId
    const receiver = req.body.receiverId
    const newConversation = new Conversation({
        members: [sender, receiver],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getAllConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.user._id.toHexString()] },
        });
        console.log(conversation)
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getOneConversation = async (req, res) => {
    try {
        const firstUserId = req.params.firstUserId
        const secondUserId = req.params.secondUserId
        const conversation = await Conversation.findOne({
            members: { $all: [firstUserId, secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};