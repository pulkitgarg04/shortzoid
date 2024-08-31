const express = require("express");
const { loggedIn } = require("../middlewares/auth.middleware.js");
const router = express.Router();
const {
    manageURLs,
    renderAnalytics
} = require("../controllers/url.controller.js");

router.get('/', loggedIn, (req, res) => {
    res.render("dashboard/index");
});

router.get('/manage', loggedIn, manageURLs);

router.get('/analytics', loggedIn, renderAnalytics);

module.exports = router;