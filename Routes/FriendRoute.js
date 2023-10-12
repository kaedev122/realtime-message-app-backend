const { GetFriends, AddFriendUser, UnfriendUser, GetRandomUser, FindUserByUsername } = require("../Controllers/FriendController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");
const router = require("express").Router();

router.get("/listfriends", userVerification, GetFriends);
router.put("/:id/addfriend", userVerification, AddFriendUser);
router.put("/:id/unfriend", userVerification, UnfriendUser);
router.get("/random", userVerification, GetRandomUser);
router.get("/find", userVerification, FindUserByUsername);

module.exports = router;