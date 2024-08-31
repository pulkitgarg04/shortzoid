const express = require("express");
const {
    generateNewURL,
    handleDeleteURL
} = require("../controllers/url.controller.js");
const analyticsController = require('../controllers/analytics.controller.js');
const URL = require("../models/url.model.js");
const router = express.Router();

router.post('/', generateNewURL);
router.delete('/delete/:shortID', handleDeleteURL);
router.get('/analytics/:shortID', async (req, res) => {
    const shortID = req.params.shortID;

    try {
        const urlEntry = await URL.findOne({ shortID });

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.render('dashboard/single-url-analytics', {
            shortID,
            totalNumberOfClicks: urlEntry.visitHistory.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/analytics/s/:shortID', analyticsController.singleURLStats);

module.exports = router;