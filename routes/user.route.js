const express = require("express");

const { auth } = require("../middlewares/auth.middleware.js");
const {
    signUp,
    login,
    logout,
    forgetPassword,
    // sendOTP,
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
// router.post('/sendOTP', sendOTP);
// router.post('/changePassword', auth, changePassword)

module.exports = router;