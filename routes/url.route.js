const express = require("express");
const multer = require("multer");
const {
    generateNewURL,
    handleDeleteURL,
    bulkCreateURLs,
    verifyLinkPassword
} = require("../controllers/url.controller.js");

const { singleURLStats } = require('../controllers/analytics.controller');
const URL = require("../models/url.model.js");
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

router.post('/', generateNewURL);
router.post('/bulk', upload.single('csvFile'), bulkCreateURLs);
router.post('/verify-password/:shortID', verifyLinkPassword);
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