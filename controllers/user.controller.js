const User = require("../models/user.model.js");
const { setUser } = require("../services/auth");

async function handleUserSignUp(req, res) {
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
}

async function handleUserLogin(req, res) {
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
}

module.exports = {
    handleUserLogin,
    handleUserSignUp
};