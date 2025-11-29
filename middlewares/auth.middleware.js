const { getUser } = require("../services/auth.js");

async function loggedIn(req, res, next) {
    const tokenCookie = req.cookies?.token;
    if(!tokenCookie) return res.redirect('/login');

    try {
        const user = getUser(tokenCookie);
        if(!user) return res.redirect('/login');
    
        req.user = user;
        return next();
    } catch (error) {
        return res.redirect('/login');
    }
}

async function checkAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;
    if(!tokenCookie) return next();

    try {
        const token = tokenCookie;
        const user = getUser(token);
        req.user = user;
    } catch (error) {
        req.user = null;
    }
    return next();
}

function redirectIfLoggedIn(req, res, next) {
    if (req.user) {
        return res.redirect('/dashboard');
    }
    return next();
}

module.exports = {
    loggedIn,
    checkAuthentication,
    redirectIfLoggedIn
}