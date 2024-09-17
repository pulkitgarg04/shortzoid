const express = require('express');
const router = express.Router();
const User = require("../models/user.model.js");
const bcrypt = require('bcryptjs');

const sendMail = require("../utils/mailSender.js");
const { passwordUpdated } = require("../mailTemplates/passwordUpdateEmail.mailTemplate.js");

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

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        await user.save();

        const htmlContent = passwordUpdated(user.name, user.resetRequestDate);
        await sendMail(user.email, 'ShortZoid - Your Password Has Been Successfully Updated', htmlContent);

        res.redirect('/login');
    } catch (err) {
        return res.status(500).json({
            error: 'An error occurred while resetting the password. Please try again later.'
        });
    }
});

module.exports = router;