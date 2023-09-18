const { Signup, Login, Logout } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");
const router = require("express").Router();

router.post('/', userVerification);
router.post("/signup", Signup);
router.post('/login', Login);
router.post('/logout', userVerification, Logout)

module.exports = router;