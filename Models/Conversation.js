const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    group: {
      type: Boolean,
      default: false,
    },
    groupPicture: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);