const express = require("express");

const { auth } = require("../middlewares/auth.middleware.js");
const {
    signUp,
    login,
    // sendOTP,
    forgetPassword,
    // changePassword
} = require("../controllers/user.controller.js");

const router = express.Router();

// router.post('/sendOTP', sendOTP);
router.post('/signup', signUp);
router.post('/login', login);
router.get('/forget-password', async (req, res) => {
    return res.render("auth/forget-password");
});
router.post('/forget-password', forgetPassword)
// router.post('/changePassword', auth, changePassword)

module.exports = router;