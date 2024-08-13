const express = require('express');
const URL = require('../models/url.model.js');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/login');
    }

    const allUrls = await URL.find({
        createdBy: req.user._id
    });

    return res.render("home", {
        urls: allUrls,
    });
});

router.get('/user/signup', async (req, res) => {
    return res.render("signup");
});

router.get('/user/login', async (req, res) => {
    return res.render("login");
});

module.exports = router;