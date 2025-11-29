const shortid = require('shortid');
const bcrypt = require('bcryptjs');
const URLModel = require('../models/url.model.js');
const Folder = require('../models/folder.model.js');

function checkIfURL(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function isValidAlias(alias) {
    if (!alias) return true;
    const aliasRegex = /^[a-zA-Z0-9_-]{3,50}$/;
    return aliasRegex.test(alias);
}

async function generateNewURL(req, res) {
    const body = req.body;
    const folders = await Folder.find({ createdBy: req.user._id });

    if (!body.url) {
        return res.status(400).render("dashboard/index", {
            error: 'URL is missing',
            folders
        });
    }

    if (!checkIfURL(body.url)) {
        return res.status(400).render("dashboard/index", {
            error: 'Please enter a valid URL!',
            folders
        });
    }

    if (!body.customAlias || !body.customAlias.trim()) {
        const existingURL = await URLModel.findOne({ 
            redirectURL: body.url, 
            createdBy: req.user._id 
        });

        if (existingURL) {
            return res.render("dashboard/index", {
                id: existingURL.shortID,
                qrcode: existingURL.qrcode,
                folders
            });
        }
    }

    let shortID = shortid();
    let customAlias = null;
    
    if (body.customAlias && body.customAlias.trim()) {
        customAlias = body.customAlias.trim().toLowerCase();
        
        if (!isValidAlias(customAlias)) {
            return res.status(400).render("dashboard/index", {
                error: 'Custom alias must be 3-50 characters and contain only letters, numbers, hyphens, and underscores.',
                folders
            });
        }
        
        const existingAlias = await URLModel.findOne({ 
            $or: [{ customAlias }, { shortID: customAlias }] 
        });
        if (existingAlias) {
            return res.status(400).render("dashboard/index", {
                error: 'This custom alias is already taken. Please choose another.',
                folders
            });
        }
        shortID = customAlias;
    }

    const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=500&margin=null&color=000000&bgcolor=ffffff&format=png&data=${body.url}`;

    try {
        let expiresAt = null;
        if (body.expiresAt) {
            expiresAt = new Date(body.expiresAt);
        }

        let maxClicks = null;
        if (body.maxClicks && parseInt(body.maxClicks) > 0) {
            maxClicks = parseInt(body.maxClicks);
        }

        let password = null;
        let isPasswordProtected = false;
        if (body.password && body.password.trim()) {
            password = await bcrypt.hash(body.password, 10);
            isPasswordProtected = true;
        }

        let folder = null;
        if (body.folder && body.folder !== '') {
            folder = body.folder;
            await Folder.findByIdAndUpdate(folder, { $inc: { linkCount: 1 } });
        }

        let deepLinks = { ios: {}, android: {} };
        let isDeepLinkEnabled = false;
        
        if (body.iosAppUrl || body.iosStoreUrl || body.androidAppUrl || body.androidStoreUrl) {
            isDeepLinkEnabled = true;
            deepLinks = {
                ios: {
                    appUrl: body.iosAppUrl || null,
                    fallbackUrl: body.iosStoreUrl || null
                },
                android: {
                    appUrl: body.androidAppUrl || null,
                    fallbackUrl: body.androidStoreUrl || null
                }
            };
        }

        await URLModel.create({
            name: body.name || body.url,
            shortID: shortID,
            customAlias: customAlias,
            redirectURL: body.url,
            qrcode: qrcode,
            expiresAt: expiresAt,
            maxClicks: maxClicks,
            password: password,
            isPasswordProtected: isPasswordProtected,
            folder: folder,
            deepLinks: deepLinks,
            isDeepLinkEnabled: isDeepLinkEnabled,
            visitHistory: [],
            createdBy: req.user._id
        });

        return res.render("dashboard/index", {
            id: shortID,
            qrcode: qrcode,
            folders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).render("dashboard/index", {
            error: 'Internal Server Error',
            folders
        });
    }
}

async function bulkCreateURLs(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No CSV file uploaded' });
        }

        const csvData = req.file.buffer.toString('utf-8');
        const lines = csvData.split('\n').filter(line => line.trim());
        
        const startIndex = lines[0].toLowerCase().includes('url') ? 1 : 0;
        
        const results = [];
        const errors = [];

        for (let i = startIndex; i < lines.length; i++) {
            const columns = lines[i].split(',').map(col => col.trim());
            const url = columns[0];
            const name = columns[1] || url;
            const customAlias = columns[2] || null;

            if (!checkIfURL(url)) {
                errors.push({ line: i + 1, url, error: 'Invalid URL' });
                continue;
            }

            if (!customAlias) {
                const existingURL = await URLModel.findOne({ 
                    redirectURL: url, 
                    createdBy: req.user._id 
                });

                if (existingURL) {
                    results.push({ line: i + 1, url, shortID: existingURL.shortID, success: true });
                    continue;
                }
            }

            let shortID = shortid();
            let aliasToUse = null;

            if (customAlias && isValidAlias(customAlias)) {
                const existing = await URLModel.findOne({ 
                    $or: [{ customAlias }, { shortID: customAlias }] 
                });
                if (!existing) {
                    shortID = customAlias;
                    aliasToUse = customAlias;
                }
            }

            const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=500&margin=null&color=000000&bgcolor=ffffff&format=png&data=${url}`;

            try {
                await URLModel.create({
                    name: name,
                    shortID: shortID,
                    customAlias: aliasToUse,
                    redirectURL: url,
                    qrcode: qrcode,
                    visitHistory: [],
                    createdBy: req.user._id
                });
                results.push({ line: i + 1, url, shortID, success: true });
            } catch (err) {
                errors.push({ line: i + 1, url, error: err.message });
            }
        }

        return res.json({
            success: true,
            created: results.length,
            failed: errors.length,
            results,
            errors
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function manageURLs(req, res) {
    try {
        const userId = req.user._id;
        const { folder, password, deeplink, expiration, maxclicks } = req.query;
        
        let query = { createdBy: userId };
        
        if (folder) {
            query.folder = folder;
        }

        if (password === 'true') {
            query.isPasswordProtected = true;
        }

        if (deeplink === 'true') {
            query.isDeepLinkEnabled = true;
        }

        if (expiration === 'true') {
            query.expiresAt = { $ne: null };
        }

        if (maxclicks === 'true') {
            query.maxClicks = { $ne: null };
        }
        
        const userURLs = await URLModel.find(query).populate('folder');
        const folders = await Folder.find({ createdBy: userId });

        if (!userURLs) {
            return res.status(404).send({
                error: 'URLs not found'
            });
        }

        return res.render("dashboard/manage", {
            urls: userURLs,
            folders,
            currentFolder: folder || null,
            filters: {
                password: password === 'true',
                deeplink: deeplink === 'true',
                expiration: expiration === 'true',
                maxclicks: maxclicks === 'true'
            }
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
        const userURLs = await URLModel.find({ createdBy: userId });

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
        const urlToDelete = await URLModel.findOne({
            shortID: shortID,
            createdBy: req.user._id
        });

        if (urlToDelete && urlToDelete.folder) {
            await Folder.findByIdAndUpdate(urlToDelete.folder, { $inc: { linkCount: -1 } });
        }

        const result = await URLModel.findOneAndDelete({
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

async function verifyLinkPassword(req, res) {
    const { shortID } = req.params;
    const { password } = req.body;

    try {
        const urlEntry = await URLModel.findOne({ shortID });
        
        if (!urlEntry) {
            return res.status(404).render('error', { message: 'Link not found' });
        }

        if (!urlEntry.isPasswordProtected) {
            return res.redirect(`/${shortID}`);
        }

        const isValid = await bcrypt.compare(password, urlEntry.password);
        
        if (isValid) {
            res.cookie(`link_access_${shortID}`, 'granted', { 
                maxAge: 3600000, // 1 hour
                httpOnly: true 
            });
            return res.redirect(`/${shortID}`);
        } else {
            return res.render('link-password', { 
                shortID, 
                error: 'Incorrect password. Please try again.' 
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { message: 'Internal Server Error' });
    }
}

module.exports = {
    generateNewURL,
    manageURLs,
    renderAnalytics,
    handleDeleteURL,
    bulkCreateURLs,
    verifyLinkPassword
};