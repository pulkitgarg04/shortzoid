const express = require("express");

const { auth } = require("../middlewares/auth.middleware.js");
const {
    signUp,
    login,
    logout,
    forgetPassword,
    verifyOTP,
    // changePassword
    showProfile,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.get('/forget-password', async (req, res) => {
    return res.render("auth/forget-password");
});
router.post('/forget-password', forgetPassword)
router.get('/account', showProfile);
router.get('/verify-otp', (req, res) => {
    return res.render("auth/verify-otp", {
        message: "User signed up successfully. Please check your email for the OTP."
    });
});
router.post('/verify-otp', verifyOTP);
// router.post('/changePassword', auth, changePassword)

module.exports = router;