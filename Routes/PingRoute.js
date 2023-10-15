const { Ping, UploadAvatar, UploadImage } = require("../Controllers/PingController");
const uploadFile = require('../Middlewares/UploadMiddlewares')

const router = require("express").Router();

router.get("/ping", Ping);
router.post("/upload", uploadFile.single('avatar'), UploadImage);

module.exports = router;