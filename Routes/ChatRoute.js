const { createConversation, getAllConversation, getOneConversation, createGroupConversation } = require("../Controllers/ConversationController");
const { createMessage, getAllMessage } = require("../Controllers/MessageController.js");
const { userVerification } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.post("/c", userVerification, createConversation);
router.post("/c/group", userVerification, createGroupConversation);
router.get("/c", userVerification, getAllConversation);
router.get("/c/:firstUserId/:secondUserId", userVerification, getOneConversation);

router.post("/m", userVerification, createMessage);
router.get("/m/:conversationId", userVerification, getAllMessage);

module.exports = router;