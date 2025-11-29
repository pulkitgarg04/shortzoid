const Newsletter = require('../models/newsletter.model.js');

async function subscribeNewsletter(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingSubscriber = await Newsletter.findOne({ email });

        if (existingSubscriber) {
            return res.status(400).json({ error: 'Email is already subscribed' });
        }

        await Newsletter.create({ email });

        return res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    subscribeNewsletter
};
