const { UpdateProfile, GetUserProfile,GetThisUserProfile, GetFriends, AddFriendUser, UnfriendUser } = require("../Controllers/UserController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.get("/profile", userVerification, GetThisUserProfile);
router.get("/profile/:id", userVerification, GetUserProfile);
router.put("/profile/:id", userVerification, UpdateProfile);
router.get("/friends", userVerification, GetFriends);
router.put("/:id/addfriend", userVerification, AddFriendUser);
router.put("/:id/unfriend", userVerification, UnfriendUser);

module.exports = router;