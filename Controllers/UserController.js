const User = require('../Models/UserModel');
const bcrypt = require('bcrypt');

module.exports.UpdateProfile = async (req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
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