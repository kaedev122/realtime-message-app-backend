const User = require("../Models/User.js");
const { createSecretToken } = require('../Utils/SecretToken.js');
const bcrypt = require('bcrypt');

module.exports.Signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({
                message: 'User already exists',
                success: false,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email: email,
            password: hashedPassword,
            username: username,
        });

        return res.status(201).json({
            message: 'User signed up successfully',
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res) => {
    try {
        const { email, password, device_token } = req.body;
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'All fields are required',
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Incorrect password or email',
            });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({
                success: false,
                message: 'Incorrect password or email',
            });
        }

        const token = createSecretToken(user._id);
        let oldTokens = user.tokens || [];
        if (oldTokens.length) {
            oldTokens = oldTokens.filter((t) => {
                const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
                if (timeDiff < 2592000) {
                    return t;
                }
            });
        }

        await User.findByIdAndUpdate(user._id, {
            tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
            device_token: device_token
        });

        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar ? user.avatar : '',
        };

        res.status(201).json({
            message: 'User logged in successfully',
            success: true,
            userInfo,
            token,
        });

    } catch (error) {
        console.error(error);
    }
};

module.exports.Logout = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: 'Authorization fail!' });
        }

        const tokens = req.user.tokens;
        console.log(tokens)
        const newTokens = tokens.filter((t) => t.token != token);

        await User.findByIdAndUpdate(req.user._id, { tokens: newTokens, device_token: '' });
        res.json({ success: true, message: 'Sign out successfully!' });
    }
};
