const { createConversation, getAllConversation, getOneConversation } = require("../Controllers/ConversationController");
const { createMessage, getAllMessageFromConversation } = require("../Controllers/MessageController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.post("/", userVerification, createConversation);
router.get("/:userId", userVerification, getAllConversation);
router.get("/:firstUserId/:secondUserId", userVerification, getOneConversation);

router.post("/m/", userVerification, createMessage);
router.get("/m/:conversationId", userVerification, getAllMessageFromConversation);

module.exports = router;