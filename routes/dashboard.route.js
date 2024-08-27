const express = require("express");

const router = express.Router();

router.get('/', (req, res) => {
    res.render("dashboard/index");
});

router.get('/manage-urls', (req, res) => {
    res.render("dashboard/manage-urls");
});

router.get('/analytics', (req, res) => {
    res.render("dashboard/analytics");
});

router.get('/qrcodes', (req, res) => {
    res.render("dashboard/generate-qr-code");
});

module.exports = router;