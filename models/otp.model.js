const mongoose = require("mongoose");
const mailSender = require('../utils/mailSender.js');
const emailTemplate = require('../mailTemplates/otpVerification.mailTemplate.js');
const User = require('../models/User');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 10 * 60,
    },
});

async function sendVerificationMail(email, otp) {
    try {
        const user = await User.findOne({ email });
        const name = user ? user.name : "User";
        
        const mailResponse = await mailSender(
            email,
            "ShortZoid Login: Here's the verification code you requested",
            emailTemplate(otp, name)
        );
        console.log("Email sent successfully: ", mailResponse);
        return {
            success: true
        };
    } catch (err) {
        console.log("Error Occured While Sending Mail: ", error);
        return {
            success: false,
            errorCode: "EMAIL_SEND_ERROR",
            errorMessage: "Email sending failed",
        };
    }
};

OTPSchema.pre("save", async function (next) {
    const email = this.email;
    const otp = this.otp;

    const result = await sendVerificationMail(email, otp);
    if (!result.success) {
        console.error("Error during OTP email sending: ", result.errorMessage);
    }

    next();
});

module.exports = mongoose.model("OTP", OTPSchema);