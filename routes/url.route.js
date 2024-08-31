const express = require("express");
const {
    generateNewURL,
    handleDeleteURL
} = require("../controllers/url.controller.js");

const { singleURLStats } = require('../controllers/analytics.controller');
const URL = require("../models/url.model.js");
const router = express.Router();

router.post('/', generateNewURL);
router.delete('/delete/:shortID', handleDeleteURL);
router.get('/analytics/:shortID', async (req, res) => {
    const shortID = req.params.shortID;

    try {
        const url = await URL.findOne({ shortID });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const name = url.name;
        const redirectURL = url.redirectURL;

        res.render('dashboard/view-analytics', {
            name,
            shortID,
            redirectURL,
            totalNumberOfClicks: url.visitHistory.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/analytics/s/:shortID', singleURLStats);

module.exports = router;