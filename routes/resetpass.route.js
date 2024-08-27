const express = require('express');
const router = express.Router();
const User = require("../models/user.model.js");

router.get('/:token', async (req, res) => {
    const { token } = req.params;
    res.render('auth/reset-password', { token });
});

router.post('/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password, 'confirm-password': confirmPassword } = req.body;
    
        const user = await User.findOne({
            resetPasswordToken: token,
        });

        if (!user) {
            return res.status(400).render('auth/reset-password', {
                token,
                error: 'Password reset token is invalid or has expired.'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).render('auth/reset-password', {
                token,
                error: 'Passwords do not match. Please try again.'
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        await user.save();

        res.redirect('/login');
    } catch (err) {
        return res.status(500).json({
            error: 'An error occurred while resetting the password. Please try again later.'
        });
    }
});

module.exports = router;