const User = require("../Models/User.js");
const Conversation = require("../Models/Conversation.js");
const Promise = require('bluebird');
const {v2} = require('cloudinary');
const {createReadStream} = require('streamifier')

function uploadToCloudinary(image) {
    return new Promise((resolve, reject) => {
        const stream = v2.uploader.upload_stream({folder: "groupAvatar",}, (error, result) => {
            if (error) return reject(error);
            return resolve(result.url);
        })
        createReadStream(image).pipe(stream);
    })
}
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

module.exports.createGroupConversation =  async (req, res) => {
    const newConversation = new Conversation({
        members: req.body.members,
        group: true
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.updateGroupConversation =  async (req, res) => {
    try {
        req.body.groupAvatar = await uploadToCloudinary(req.file.buffer);
        await Conversation.findByIdAndUpdate(req.params.conversationId, {
            $set: req.body,
        });
        res.status(200).json({
            message: 'Conversation has been updated',
            success: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getAllConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.user._id.toHexString()] },
        });
        const result = await Promise.map(conversation, async (item) => {
            const usersData = await User.find({ _id: { $in: item.members } });
            const users = usersData.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            }));
            return {
                _id: item._id,
                group: item.group,
                groupAvatar: item.groupAvatar,
                groupName: item.groupName,
                createdAt: item.createdAt,
                members: users,
                watched: item.watched
            }
        })
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getOneConversation = async (req, res) => {
    try {
        const firstUserId = req.params.firstUserId
        const secondUserId = req.params.secondUserId
        const conversation = await Conversation.findOne({
            members: {$all: [firstUserId, secondUserId]},
            group: false
        });
        return res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.updateUserWatched = async (req, res) => {
    try {
        const conversation = await Conversation.findByIdAndUpdate(req.params.conversationId, {
            $addToSet: {watched: {$each: [req.user._id]}}
        })
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
}