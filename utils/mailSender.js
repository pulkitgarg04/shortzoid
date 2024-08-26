const nodemailer = require("nodemailer");
require('dotenv').config();

const mailsender = async (email, subject, htmlContent) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `ShortZoid <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
}

module.exports = mailsender;