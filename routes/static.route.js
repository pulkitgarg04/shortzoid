const express = require('express');
const URL = require('../models/url.model.js');
const router = express.Router();
const { logout } = require('../controllers/user.controller.js');
const { redirectIfLoggedIn } = require('../middlewares/auth.middleware.js');

router.get('/', (req, res) => {
    return res.render("home", {
        user: req.user
    });
});

router.get('/signup', redirectIfLoggedIn, async (req, res) => {
    return res.render("auth/signup");
});

router.get('/login', redirectIfLoggedIn, async (req, res) => {
    return res.render("auth/login");
});

router.get('/logout', logout);

module.exports = router;