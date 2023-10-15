const { Ping, UploadAvatar } = require("../Controllers/PingController");
const uploadFile = require('../Middlewares/UploadMiddlewares')

const router = require("express").Router();

router.get("/ping", Ping);
router.post("/upload", uploadFile.single('avatar'), UploadAvatar);

module.exports = router;