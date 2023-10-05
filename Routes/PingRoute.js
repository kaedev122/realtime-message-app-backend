const { Ping } = require("../Controllers/PingController");

const router = require("express").Router();

router.get("/ping", Ping);

module.exports = router;