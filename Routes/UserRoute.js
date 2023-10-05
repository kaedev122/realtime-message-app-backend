const { UpdateProfile, GetUserProfile } = require("../Controllers/UserController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.get("/:id", userVerification, GetUserProfile);
router.put("/:id", userVerification, UpdateProfile);

module.exports = router;