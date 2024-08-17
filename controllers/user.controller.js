const User = require("../models/user.model.js");
const { setUser } = require("../services/auth");

// Handle User Signup
async function handleUserSignUp(req, res) {
    try{
        const {
            name,
            email,
            password
        } = req.body;

        const newUser = await User.create({
            name,
            email,
            password
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).render("signup", { error: "Error creating account. Please try again." });
    }
};

// Handle User Login
async function handleUserLogin(req, res) {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({
            email,
            password
        });

        if(!user) {
            return res.render("login", {
                error: "Invalid Username or Password",
            });
        }

        const token = setUser(user);
        if (!token) {
            return res.render("login", {
                error: "Error generating token. Please try again.",
            });
        }
        res.cookie("token", token);
        return res.redirect('/');
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).render("login", { error: "Internal Server Error. Please try again." });
    }
}


// Handle User Logout
async function handleUserLogout(req, res) {
    return res.clearCookie('token').redirect('/');
}

// Show Account Info
async function showAccountInfo(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/user/login');
        }
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.redirect('/user/login');
        }

        return res.render('account', {
            user
        });
    } catch (error) {
        console.error("Error retrieving account info:", error);
        return res.status(500).redirect('/user/login');
    }
};

// Render Account Info
async function renderEditAccountPage(req, res) {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.redirect('/user/login');
    }

    return res.render('edit-profile', { user });
}

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

        res.redirect('/user/account');

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    handleUserLogin,
    handleUserSignUp,
    handleUserLogout,
    showAccountInfo,
    renderEditAccountPage,
    editAccountInfo
};