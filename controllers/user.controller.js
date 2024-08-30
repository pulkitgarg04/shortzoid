const User = require("../models/user.model.js");
const OTP = require("../models/otp.model.js");
const jwt = require("jsonwebtoken");
const { setUser, getUser } = require("../services/auth");
const axios = require('axios');

const sendMail = require("../utils/mailSender.js");
const { forgetPasswordTemplate } = require("../mailTemplates/forgetPasswordTemplate.mailTemplate.js");
const { otpTemplate } = require("../mailTemplates/otpVerification.mailTemplate.js");
const { passwordUpdated } = require("../mailTemplates/passwordUpdateEmail.mailTemplate.js");

function generateOTP() {
    return Math.floor(Math.random() * 900000 + 100000).toString();
}

// Handle User Signup
async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;

        const checkForExistingUser = await User.findOne({ email });
        if (checkForExistingUser) {
            return res.status(500).render("auth/signup", {
                error: "Account already registered with this email."
            });
        }

        const newUser = await User.create({ name, email, password });

        const token = setUser(newUser);
        if (!token) {
            return res.render("auth/signup", {
                error: "Error generating token. Please try again.",
            });
        }

        res.cookie("token", token);

        const otp = generateOTP();
        const otpDocument = new OTP({ email, otp });
        await otpDocument.save();

        const htmlContent = otpTemplate(otp, newUser.name);
        await sendMail(newUser.email, "ShortZoid Login: Here's the verification code you requested", htmlContent);

        // return res.redirect("/user/verify-otp");
        return res.redirect(`/user/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).render("auth/signup", { error: "Error creating account. Please try again." });
    }
};

// Resend Email Verification OTP
async function resendOTP(req, res) {
    try {
        const email = req.email;
        // console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('auth/verify-otp', { error: "User not found" });
        }

        const otp = generateOTP();
        const otpDocument = new OTP({ email, otp });
        await otpDocument.save();

        const htmlContent = otpTemplate(otp, user.name);
        await sendMail(email, "ShortZoid Login: Here's your new verification code", htmlContent);

        return res.render('auth/verify-otp', {
            message: "OTP has been resent. Please check your email.",
            email
        });
    } catch (error) {
        console.error("Error during OTP resend:", error);
        return res.status(500).render('auth/verify-otp', { error: "An error occurred. Please try again." });
    }
}

// Handle User Login
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email,
            password
        });

        if (!user) {
            return res.render("auth/login", {
                error: "Invalid Username or Password",
            });
        }

        if (!user.isVerified) {
            const otp = generateOTP();
            const otpDocument = new OTP({ email, otp });
            await otpDocument.save();

            const htmlContent = otpTemplate(otp, user.name);
            await sendMail(user.email, "ShortZoid Login: Here's the verification code you requested", htmlContent);

            return res.redirect(`/user/verify-otp?email=${encodeURIComponent(email)}&error=${encodeURIComponent("You need to verify your email before logging in. We have sent OTP on your email!")}`);
        }

        const token = setUser(user);
        if (!token) {
            return res.render("auth/login", {
                error: "Error generating token. Please try again.",
            });
        }
        res.cookie("token", token);
        return res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).render("auth/login", {
            error: "Internal Server Error. Please try again."
        });
    }
}

// Handle User Logout
async function logout(req, res) {
    return res.clearCookie('token').redirect('/');
}

// Handle forget password route
async function forgetPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.render("auth/forget-password", {
                error: 'User with this email does not exist.',
            });
        }

        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('IP Address:', ipAddress);
        const now = new Date();
        const dateTime = now.toISOString();

        const geoUrl = `http://api.ipstack.com/${ipAddress}?access_key=${process.env.IPSTACK_API_KEY}`;
        try {
            const response = await axios.get(geoUrl);
            const locationData = response.data;
            const location = `${locationData.city || 'N/A'}, ${locationData.region_name || 'N/A'}, ${locationData.country_name || 'N/A'}`;
            user.resetRequestLocation = location;
        } catch (error) {
            console.error('Error fetching geolocation data:', error);
            user.resetRequestLocation = 'Location data unavailable';
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET,
        );

        user.resetPasswordToken = token;
        user.resetRequestDate = dateTime;
        user.resetRequestLocation = location;
        await user.save();

        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
        const htmlContent = forgetPasswordTemplate(resetUrl, user.name);

        await sendMail(user.email, 'Reset your ShortZoid password', htmlContent);

        return res.render("auth/forget-password", {
            message: 'Password reset link has been sent to your email.',
        });
    } catch (error) {
        return res.render("auth/forget-password", {
            error: 'Error sending email. Please try again later.'
        });
    }
}

// Verify Email through OTP
async function verifyOTP(req, res) {
    try {
        const email = req.query.email;
        // console.log(email);
        const { otp } = req.body;

        const userOTP = await OTP.findOne({ email, otp });

        if (!userOTP) {
            return res.render("auth/verify-otp", {
                error: "Invalid OTP or OTP has expired",
                email
            });
        }

        await User.updateOne({ email }, { $set: { isVerified: true } });
        await OTP.deleteOne({ email, otp });

        res.redirect("/dashboard");
    } catch (err) {
        console.error("Error during OTP verification:", error);
        return {
            error: "An error occurred during OTP verification",
        };
    }
}

// Show Account Info
async function showProfile(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.redirect('/login');
        }

        return res.render('user/profile', { user });
    } catch (error) {
        return res.status(500).redirect('/login');
    }
};

// Edit Account Info
async function editAccountInfo(req, res) {
    try {
        const user = req.user._id;
        const { name, email, gender, location } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            user,
            {
                name,
                email,
                gender,
                location
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.redirect('/user/profile');

    } catch (error) {
        // console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Handle Change Password
async function changePassword(req, res) {
    try {
        const tokenCookie = req.cookies?.token;

        const decodedToken = getUser(tokenCookie);
        const user = await User.findById(decodedToken._id);
        if (!user) return res.redirect('/login');

        const { password, 'confirm-password': confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).render('auth/reset-password', {
                token,
                error: 'Passwords do not match. Please try again.'
            });
        }

        user.password = password;

        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('IP Address:', ipAddress);
        const now = new Date();
        const dateTime = now.toISOString();

        const geoUrl = `http://api.ipstack.com/${ipAddress}?access_key=${process.env.IPSTACK_API_KEY}`;

        const response = await axios.get(geoUrl);
        const locationData = response.data;
        const location = `${locationData.city || 'N/A'}, ${locationData.region_name || 'N/A'}, ${locationData.country_name || 'N/A'}`;
        user.resetRequestLocation = location;

        user.resetRequestDate = dateTime;
        user.resetRequestLocation = location;
        await user.save();

        const htmlContent = passwordUpdated(user.name, user.resetRequestDate, user.resetRequestLocation);
        await sendMail(user.email, 'ShortZoid - Your Password Has Been Successfully Updated', htmlContent);

        res.redirect('/user/profile');
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'An error occurred while resetting the password. Please try again later.'
        });
    }
}

module.exports = {
    signUp,
    login,
    logout,
    forgetPassword,
    verifyOTP,
    resendOTP,
    changePassword,
    showProfile,
    editAccountInfo,
    changePassword
};