const User = require("../Models/User.js");
const Message = require("../Models/Message.js");
const Conversation = require("../Models/Conversation.js");
const {v2} = require('cloudinary');
const {createReadStream} = require('streamifier')
const {sendPushNotification} = require('../Utils/PushNotification.js')
const Promise = require('bluebird');

function uploadToCloudinary(image) {
    return new Promise((resolve, reject) => {
        const stream = v2.uploader.upload_stream({folder: "image",}, (error, result) => {
            if (error) return reject(error);
            return resolve(result.url);
        })
        createReadStream(image).pipe(stream);
    })
}

module.exports.createMessage = async (req, res) => {
    if (req.file) {
        req.body.image = await uploadToCloudinary(req.file.buffer);
    }
    try {
        const userId = req.user._id
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        const updatedConversation = await Conversation.findByIdAndUpdate(req.body.conversationId, {
            watched: [userId],
            lastestMessage: savedMessage
        })
        const members = updatedConversation.members
        const list_device_token = await Promise.map(members, async (member) => {
            if (userId.toString().includes(member)) {
                return
            }
            const device_token = await User.findById(member).select("device_token -_id");
            return device_token.device_token ? device_token.device_token : undefined
        })
        console.log(list_device_token);
        list_device_token.map(item => {
            sendPushNotification(item, req.user.username, req.body.text, updatedConversation.groupName);
        })
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getAllMessage = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        .select("-updatedAt -__v")
        .populate("sender", "_id username profilePicture")
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
};