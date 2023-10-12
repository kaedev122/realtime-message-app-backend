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

module.exports.GetUsersProfiles = async (req, res) => {
    const { ids } = req.body;
    if (ids && Array.isArray(ids) && ids.length > 0) {
        try {
            const usersData = await User.find({ _id: { $in: ids } });
            const users = usersData.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            }));
            return res.status(200).json({
                users,
                success: true,
            });
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`,
                success: false,
            });
        }
    }
    return res.status(400).json({
        message: `Invalid input. Please provide an array of user _ids.`,
        success: false,
    });
};

