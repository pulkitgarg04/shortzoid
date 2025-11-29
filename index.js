require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");

const staticRoute = require('./routes/static.route.js');
const dashboardRoute = require('./routes/dashboard.route.js');
const urlRoute = require('./routes/url.route');
const userRoute = require('./routes/user.route');
const redirectRoute = require('./routes/redirect.route');
const resetPasswordRoute = require('./routes/resetpass.route');
const folderRoute = require('./routes/folder.route');

const { checkAuthentication } = require("./middlewares/auth.middleware.js");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/database.js");

connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication);

app.use('/', staticRoute);
app.use('/user', userRoute);
app.use('/dashboard', checkAuthentication, dashboardRoute);
app.use('/r', redirectRoute);
app.use('/reset-password', resetPasswordRoute);
app.use('/url', urlRoute);
app.use('/api/folders', folderRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: err.message || 'Something went wrong!' });
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
});