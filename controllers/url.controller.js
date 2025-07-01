const shortid = require('shortid');
const URL = require('../models/url.model.js');

function checkIfURL(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

async function generateNewURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).render("dashboard/index", {
            error: 'URL is missing'
        });
    }

    if (!checkIfURL(body.url)) {
        return res.status(400).render("dashboard/index", {
            error: 'Please enter a valid URL!'
        });
    }

    const shortID = shortid();
    const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=500&margin=null&color=000000&bgcolor=ffffff&format=png&data=${body.url}`;

    try {
        await URL.create({
            name: body.name || body.url,
            shortID: shortID,
            redirectURL: body.url,
            qrcode: qrcode,
            visitHistory: [],
            createdBy: req.user._id
        });

        return res.render("dashboard/index", {
            id: shortID,
            qrcode: qrcode
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

async function manageURLs(req, res) {
    try {
        const userId = req.user._id;
        const userURLs = await URL.find({ createdBy: userId });

        if (!userURLs) {
            return res.status(404).send({
                error: 'URLs not found'
            });
        }

        return res.render("dashboard/manage", {
            urls: userURLs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

async function renderAnalytics(req, res) {
    try {
        const userId = req.user._id;
        const userURLs = await URL.find({ createdBy: userId });

        if (!userURLs) {
            return res.status(404).send({
                error: 'URLs not found'
            });
        }

        return res.render("dashboard/analytics", {
            urls: userURLs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

async function handleDeleteURL(req, res) {
    const { shortID } = req.params;

    try {
        const result = await URL.findOneAndDelete({
            shortID: shortID,
            createdBy: req.user._id
        });

        if (result) {
            return res.redirect("/url/analytics");
        } else {
            return res.status(404).json({
                success: false,
                message: 'URL not found or you do not have permission to delete it'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

module.exports = {
    generateNewURL,
    manageURLs,
    renderAnalytics,
    handleDeleteURL
};