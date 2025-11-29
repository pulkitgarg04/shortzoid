const express = require("express");
const { loggedIn } = require("../middlewares/auth.middleware.js");
const router = express.Router();
const {
    manageURLs,
    renderAnalytics
} = require("../controllers/url.controller.js");
const Folder = require("../models/folder.model.js");

router.get('/', loggedIn, async (req, res) => {
    const folders = await Folder.find({ createdBy: req.user._id });
    res.render("dashboard/index", { folders });
});

router.get('/manage', loggedIn, manageURLs);

router.get('/analytics', loggedIn, renderAnalytics);

module.exports = router;