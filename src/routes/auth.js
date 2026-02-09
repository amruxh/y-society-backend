const express = require("express")
const router = express.Router();
const { register, login, oauthLogin } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/oauth", oauthLogin);

module.exports = router;