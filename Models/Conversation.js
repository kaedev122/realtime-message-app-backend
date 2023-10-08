const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [{}],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);