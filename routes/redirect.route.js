const express = require("express");
const router = express.Router();
const URL = require("../models/url.model.js");

router.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;

    try {
        const entry = await URL.findOneAndUpdate({
            shortID
        }, {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }, {
            new: true
        });

        if (!entry || !entry.redirectURL) {
            return res.status(404).send({
                error: 'URL not found'
            });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;