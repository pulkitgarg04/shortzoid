const express = require("express");
const {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleRedirectNewShortURL
} = require("../controllers/url.controller.js");

const router = express.Router();

router.post('/', handleGenerateNewShortURL);
router.get('/analytics/:shortID', handleGetAnalytics);
router.get('/:shortID', handleRedirectNewShortURL);

module.exports = router;