const { UpdateProfile, GetUserProfile } = require("../Controllers/UserController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.get("/profile", userVerification, GetUserProfile);
router.put("/profile/:id", userVerification, UpdateProfile);

module.exports = router;