const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Conversation',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },
    text: {
      type: String,
    },
    image: {
      type: String, 
      default: '',
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);