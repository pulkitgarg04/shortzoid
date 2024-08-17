const express = require("express");
const { loggedIn } = require("../middlewares/auth.middleware");
const {
    handleUserLogin,
    handleUserSignUp,
    handleUserLogout,
    showAccountInfo,
    editAccountInfo,
    renderEditAccountPage
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/login', handleUserLogin);
router.get('/logout', handleUserLogout);
router.get('/account', loggedIn, showAccountInfo);
router.get('/account/edit', loggedIn, renderEditAccountPage);
router.post('/account/edit', loggedIn, editAccountInfo);

module.exports = router;