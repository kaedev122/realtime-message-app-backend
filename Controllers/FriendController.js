const User = require("../Models/User.js");
const Conversation = require("../Models/Conversation.js");

module.exports.AddFriendUser = async (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);
            if (!user.friends.includes(req.user._id)) {
                await user.updateOne({ $push: { friends: currentUser._id } });
                await currentUser.updateOne({ $push: { friends: user._id } });
                const conversation = await Conversation.findOne({
                    members: {$all: [user._id, currentUser._id]},
                    group: false
                });
                if (!conversation) {
                    const newConversation = new Conversation({
                        members: [currentUser._id, user._id],
                    });
                    await newConversation.save();   
                }
                res.status(200).json({
                    "success": true,
                    "message": "user has been added"
                });
            } else {
                res.status(403).json({                    
                    "success": false,
                    "message": "you already add this user"
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
};

module.exports.UnfriendUser = async  (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);
            if (user.friends.includes(req.user._id)) {
                await user.updateOne({ $pull: { friends: currentUser._id } });
                await currentUser.updateOne({ $pull: { friends: user._id } });
                res.status(200).json("user has been unfriend");
            } else {
                res.status(403).json("you dont have friend with this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant unfriend yourself");
    }
};

module.exports.GetFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const friends = await Promise.all(
            user.friends.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json({
            success: true,
            friendList
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.GetRandomUser = async (req, res) => {
    try {
        const usersData = await User.aggregate([
            { $match: { _id: { $ne: req.user._id } } },
            { $match: { friends: { $nin: [req.user._id] } } },
            { $sample: { size: 3 } }
        ])
        
        const result = usersData.map(item => {
            return {
                _id: item._id,
                username: item.username,
                email: item.email,
                profilePicture: item.profilePicture
            }
        })
        res.status(200).json({
            result
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.FindUserByUsername = async (req, res) => {
    try {
        const usersData = await User.find({
            username: { $regex: req.body.username }
        }).select("_id username email profilePicture")
        
        res.status(200).json({
            usersData
        })
    } catch (err) {
        res.status(500).json(err);
    }
}