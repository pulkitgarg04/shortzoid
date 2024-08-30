const express = require("express");

const { checkAuthentication } = require("../middlewares/auth.middleware.js");
const {
    signUp,
    login,
    logout,
    forgetPassword,
    verifyOTP,
    resendOTP,
    changePassword,
    showProfile,
} = require("../controllers/user.controller.js");

const router = express.Router();

function extractEmail(req, res, next) {
    const email = req.query.email;
    if (!email) {
        return res.status(400).send("Email is required.");
    }
    req.email = email;
    next();
}

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.get('/forget-password', async (req, res) => {
    return res.render("auth/forget-password");
});
router.post('/forget-password', forgetPassword)
router.get('/account', showProfile);
router.get('/verify-otp', (req, res) => {
    const email = req.query.email;
    return res.render("auth/verify-otp", {
        email,
        message: "User signed up successfully. Please check your email for the OTP."
    });
});
router.post('/verify-otp', verifyOTP);
router.get('/resend-otp', extractEmail, resendOTP);
router.post('/changePassword', checkAuthentication, changePassword)

module.exports = router;