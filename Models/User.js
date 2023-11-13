const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        friends: {
            type: Array,
            default: [],
        },
        tokens: [{ type: Object }],
        device_token: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);