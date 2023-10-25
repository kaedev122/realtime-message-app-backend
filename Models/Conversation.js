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
    groupAvatar: {
      type: String,
      default: ''
    },
    groupName: {
      type: String,
    },
    watched: {
      type: Array,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);