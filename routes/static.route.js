const express = require('express');
const URL = require('../models/url.model.js');
const router = express.Router();

router.get('/', (req, res) => {
    return res.render("home");
});

router.get('/signup', async (req, res) => {
    return res.render("auth/signup");
});

router.get('/login', async (req, res) => {
    return res.render("auth/login");
});

module.exports = router;