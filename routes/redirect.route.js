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

function getOS(userAgent) {
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
    if (/Android/i.test(userAgent)) return "Android";
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac/i.test(userAgent)) return "macOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    return "Unknown";
}

router.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const userAgent = req.headers['user-agent'] || '';

    try {
        const entry = await URL.findOne({ 
            $or: [{ shortID }, { customAlias: shortID }] 
        });

        if (!entry || !entry.redirectURL) {
            return res.status(404).render('error', { 
                message: 'Link not found or has been deleted' 
            });
        }

        if (entry.expiresAt && new Date() > new Date(entry.expiresAt)) {
            return res.status(410).render('error', { 
                message: 'This link has expired' 
            });
        }

        if (entry.maxClicks && entry.visitHistory.length >= entry.maxClicks) {
            return res.status(410).render('error', { 
                message: 'This link has reached its maximum number of clicks' 
            });
        }

        if (entry.isPasswordProtected) {
            const accessCookie = req.cookies[`link_access_${shortID}`];
            if (accessCookie !== 'granted') {
                return res.render('link-password', { shortID });
            }
        }

        const browser = getBrowser(userAgent);
        const device = getDevice(userAgent);
        const os = getOS(userAgent);
        
        const visit = {
            timestamp: Date.now(),
            browser: browser,
            device: device
        };

        await URL.findByIdAndUpdate(entry._id, {
            $push: { visitHistory: visit }
        });

        if (entry.isDeepLinkEnabled) {
            if (os === 'iOS' && entry.deepLinks?.ios?.appUrl) {
                const iosAppUrl = entry.deepLinks.ios.appUrl;
                const iosFallback = entry.deepLinks.ios.fallbackUrl || entry.redirectURL;
                
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Redirecting...</title>
                        <script>
                            window.location = "${iosAppUrl}";
                            setTimeout(function() {
                                window.location = "${iosFallback}";
                            }, 1000);
                        </script>
                    </head>
                    <body>
                        <p>Redirecting... If you are not redirected, <a href="${iosFallback}">click here</a>.</p>
                    </body>
                    </html>
                `);
            }
            
            if (os === 'Android' && entry.deepLinks?.android?.appUrl) {
                const androidAppUrl = entry.deepLinks.android.appUrl;
                const androidFallback = entry.deepLinks.android.fallbackUrl || entry.redirectURL;
                
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Redirecting...</title>
                        <script>
                            window.location = "${androidAppUrl}";
                            setTimeout(function() {
                                window.location = "${androidFallback}";
                            }, 1000);
                        </script>
                    </head>
                    <body>
                        <p>Redirecting... If you are not redirected, <a href="${androidFallback}">click here</a>.</p>
                    </body>
                    </html>
                `);
            }
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error('Error in /:shortID route:', error);
        res.status(500).render('error', { 
            message: 'Internal Server Error' 
        });
    }
});

module.exports = router;
