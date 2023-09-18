const User = require('../Models/UserModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.userVerification = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decode = jwt.verify(token, process.env.TOKEN_KEY);
            // console.log("----", decode)
            const user = await User.findById(decode.UserId);
            // console.log("----", user)
            if (!user) {
                return res.json({
                    success: false,
                    message: 'unauthorized access!',
                });
            }
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.json({
                    success: false,
                    message: 'unauthorized access!',
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.json({
                    success: false,
                    message: 'sesson expired try sign in!',
                });
            }

            res.json({
                success: false,
                message: `Internal server error! ${error}`,
            });
        }
    } else {
        res.json({ success: false, message: 'unauthorized access!' });
    }
};
