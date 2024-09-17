const express = require("express");
const router = express.Router();
const URL = require("../models/url.model.js");

function getBrowser(userAgent) {
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    if (userAgent.includes("MSIE") || userAgent.includes("Trident")) return "Internet Explorer";
    if (userAgent.includes("Vivaldi")) return "Vivaldi";
    if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
    return "Unknown";
}

function getDevice(userAgent) {
    if (/Tablet|iPad/i.test(userAgent)) {
        return "Tablet";
    } else if (/Mobi|Android/i.test(userAgent)) {
        return "Mobile";
    } else {
        return "Desktop";
    }
}

router.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const userAgent = req.headers['user-agent'];

    try {
        const browser = getBrowser(userAgent);
        const device = getDevice(userAgent);
        const visit = {
            timestamp: Date.now(),
            browser: browser,
            device: device
        }

        const entry = await URL.findOneAndUpdate(
            { shortID },
            {
                $push: { visitHistory: visit },
            },
            { new: true, upsert: true }
        );

        if (!entry || !entry.redirectURL) {
            return res.status(404).send({
                error: 'URL not found'
            });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error('Error in /:shortID route:', error);
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;
