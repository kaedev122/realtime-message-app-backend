const User = require("../Models/User.js");
const Conversation = require("../Models/Conversation.js");
const Promise = require('bluebird');

module.exports.createConversation =  async (req, res) => {
    const sender = await User.findById(req.body.senderId).select('_id username email profilePicture')
    const receiver = await User.findById(req.body.receiverId).select('_id username email profilePicture')
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
          members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
      } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getOneConversation = async (req, res) => {
    try {
        const firstUserId = mongoose.Types.ObjectId(req.params.firstUserId);
        const secondUserId = mongoose.Types.ObjectId(req.params.secondUserId)
        const conversation = await Conversation.findOne({
            members: { $all: [firstUserId, secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};