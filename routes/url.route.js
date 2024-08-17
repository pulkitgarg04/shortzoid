const express = require("express");
const {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL
} = require("../controllers/url.controller.js");

const router = express.Router();

router.post('/', handleGenerateNewShortURL);
router.get('/analytics/', handleGetAnalytics);
router.delete('/delete/:shortID', handleDeleteURL);

module.exports = router;