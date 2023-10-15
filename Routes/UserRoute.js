const { UpdateProfile, GetUserProfile,GetThisUserProfile,GetUsersProfiles, } = require("../Controllers/UserController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");
const uploadFile = require('../Middlewares/UploadMiddlewares')

const router = require("express").Router();

router.get("/profile", userVerification, GetThisUserProfile);
router.get("/profile/:id", userVerification, GetUserProfile);
router.get("/profiles", userVerification, GetUsersProfiles);
router.put("/profile/:id", uploadFile.single('avatar'), userVerification, UpdateProfile);

module.exports = router;