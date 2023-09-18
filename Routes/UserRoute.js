const { UpdateProfile } = require("../Controllers/UserController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.put("/:id", userVerification, UpdateProfile);

module.exports = router;