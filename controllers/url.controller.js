const shortid = require('shortid');
const URL = require('../models/url.model.js');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).send({
            error: 'URL is missing'
        });
    }

    const shortID = shortid();

    try {
        await URL.create({
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id
        });

        return res.render("home", {
            id: shortID,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

async function handleRedirectNewShortURL(req, res) {
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
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const userId = req.user._id;
        const userURLs = await URL.find({ createdBy: userId });

        if (!userURLs) {
            return res.status(404).send({
                error: 'URLs not found'
            });
        }

        return res.render("analytics", {
            urls: userURLs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleRedirectNewShortURL,
    handleGetAnalytics
};