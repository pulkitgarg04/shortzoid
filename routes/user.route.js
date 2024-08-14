const express = require("express");
const User = require("../models/user.model.js");
const {
    handleUserLogin,
    handleUserSignUp
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/login', handleUserLogin);
router.get('/account', async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!req.user) {
        return res.redirect('/user/login');
    }

    return res.render('account', {
        user
    });
});

module.exports = router;