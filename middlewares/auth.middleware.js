const { getUser } = require("../services/auth.js");

async function loggedIn(req, res, next) {
    const tokenCookie = req.cookies?.token;
    if(!tokenCookie) return res.redirect('/login');

    const user = await getUser(tokenCookie);
    if(!user) return res.redirect('/login');

    req.user = user;
    return next();
}

async function checkAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;
    if(!tokenCookie) return next();

    const token = tokenCookie;
    const user = getUser(token);
    req.user = user;
    return next();
}

module.exports = {
    loggedIn,
    checkAuthentication
}