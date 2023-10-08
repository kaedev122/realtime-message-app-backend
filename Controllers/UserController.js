const User = require("../Models/User.js");
const Conversation = require("../Models/Conversation.js");
const bcrypt = require('bcrypt');

module.exports.UpdateProfile = async (req, res) => {
    if (req.user._id == req.params.id) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json({
                    message: `Error: ${err}`,
                    success: false,
                });
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json({
                message: 'Account has been updated',
                success: true,
            });
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err}`,
                success: false,
            });
        }
    } else {
        return res.status(403).json({
            message: 'You can update only your account!',
            success: false,
        });
    };
};

module.exports.GetThisUserProfile = async (req, res) => {
    if(req.user) {
        return res.status(200).json({
            user: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                createdAt: req.user.createdAt
            },
            success: true,
        });
    }
    return res.status(500).json({
        message: `Error!`,
        success: false,
    });
};

module.exports.GetUserProfile = async (req, res) => {
    if(req.params.id) {
        const userData = await User.findById(req.params.id);
        return res.status(200).json({
            user: {
                _id: userData._id,
                username: userData.username,
                email: userData.email,
                profilePicture: userData.profilePicture,
            },
            success: true,
        });
    }
    return res.status(500).json({
        message: `Error!`,
        success: false,
    });
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

module.exports.AddFriendUser = async (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);
            if (!user.friends.includes(req.user._id)) {
                await user.updateOne({ $push: { friends: currentUser._id } });
                await currentUser.updateOne({ $push: { friends: user._id } });
                const newConversation = new Conversation({
                    members: [currentUser._id, user._id],
                });
                await newConversation.save();   
                res.status(200).json({
                    "success": true,
                    "message": "user has been added"
                });
            } else {
                res.status(403).json({                    
                    "success": false,
                    "message": "you allready add this user"
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
};

  //unfollow a user
module.exports.UnfriendUser = async  (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);
            if (user.friends.includes(req.user._id)) {
                await user.updateOne({ $pull: { friends: req.user._id } });
                await currentUser.updateOne({ $pull: { friends: req.params.id } });
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