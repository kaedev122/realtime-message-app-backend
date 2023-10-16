const { createConversation, getAllConversation, getOneConversation, createGroupConversation, updateGroupConversation } = require("../Controllers/ConversationController");
const { createMessage, getAllMessage } = require("../Controllers/MessageController.js");
const { userVerification } = require("../Middlewares/AuthMiddlewares");
const uploadFile = require('../Middlewares/UploadMiddlewares')

const router = require("express").Router();

router.post("/c", userVerification, createConversation);
router.post("/c/group", userVerification, createGroupConversation);
router.put("/c/group/:conversationId", userVerification, uploadFile.single('groupAvatar'), updateGroupConversation);
router.get("/c", userVerification, getAllConversation);
router.get("/c/:firstUserId/:secondUserId", userVerification, getOneConversation);

router.post("/m", userVerification, uploadFile.single('image'), createMessage);
router.get("/m/:conversationId", userVerification, getAllMessage);

module.exports = router;