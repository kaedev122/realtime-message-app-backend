require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.createSecretToken = (UserId) => {
    return jwt.sign({ UserId }, process.env.TOKEN_KEY, {
        expiresIn: "30d",
    });
};