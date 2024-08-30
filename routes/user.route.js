const express = require("express");

const { checkAuthentication } = require("../middlewares/auth.middleware.js");
const {
    signUp,
    login,
    logout,
    forgetPassword,
    verifyOTP,
    resendOTP,
    showProfile,
    editAccountInfo,
    changePassword,
} = require("../controllers/user.controller.js");
const User = require("../models/user.model.js");

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
router.get('/verify-otp', (req, res) => {
    const { email, error } = req.query;

    if (error) {
        return res.render("auth/verify-otp", {
            email,
            error
        });
    }

    return res.render("auth/verify-otp", {
        email,
        message: "User signed up successfully. Please check your email for the OTP."
    });
});
router.post('/verify-otp', verifyOTP);
router.get('/resend-otp', extractEmail, resendOTP);
router.get('/profile', checkAuthentication, showProfile);
router.get('/profile/edit', checkAuthentication, async (req, res) => {
    const user = await User.findById(req.user._id);
    return res.render("user/edit-profile", { user });
});
router.post('/profile/edit', checkAuthentication, editAccountInfo);
router.get('/change-password', checkAuthentication, async (req, res) => {
    const user = await User.findById(req.user._id);
    return res.render("user/change-password", { user });
});
router.post('/change-password', checkAuthentication, changePassword);

module.exports = router;