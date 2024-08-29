const express = require("express");
const { loggedIn } = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.get('/', loggedIn, (req, res) => {
    res.render("dashboard/index");
});

router.get('/manage-urls', loggedIn, (req, res) => {
    res.render("dashboard/manage-urls");
});

router.get('/analytics', loggedIn, (req, res) => {
    res.render("dashboard/analytics");
});

module.exports = router;