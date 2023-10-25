const Message = require("../Models/Message.js");
const Conversation = require("../Models/Conversation.js");
const {v2} = require('cloudinary');
const {createReadStream} = require('streamifier')

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
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        await Conversation.findByIdAndUpdate(req.body.conversationId, {
            watched: [req.user._id],
            lastestMessage: savedMessage
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