const URL = require('../models/url.model');

exports.singleURLStats = async (req, res) => {
    const { shortID } = req.params;

    try {
        const urlEntry = await URL.findOne({ shortID });

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const visitHistory = urlEntry.visitHistory;

        const totalVisits = visitHistory.length;
        const uniqueBrowsers = new Set();
        const deviceTypes = { Mobile: 0, Desktop: 0, Tablet: 0 };

        visitHistory.forEach(visit => {
            uniqueBrowsers.add(visit.browser);

            if (visit.device === 'Mobile') {
                deviceTypes.Mobile += 1;
            } else if (visit.device === 'Desktop') {
                deviceTypes.Desktop += 1;
            } else if (visit.device === 'Tablet') {
                deviceTypes.Tablet += 1;
            }
        });

        const stats = {
            shortID: urlEntry.shortID,
            redirectURL: urlEntry.redirectURL,
            totalVisits: totalVisits,
            uniqueBrowsers: Array.from(uniqueBrowsers),
            deviceTypes: deviceTypes,
            visitHistory: visitHistory,
        };

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}