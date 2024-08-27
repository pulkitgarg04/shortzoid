require("dotenv").config({
    path: './.env'
});

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");

// Routes
const staticRoute = require('./routes/static.route.js');
const dashboardRoute = require('./routes/dashboard.route.js');
const urlRoute = require('./routes/url.route');
const userRoute = require('./routes/user.route');
const redirectRoute = require('./routes/redirect.route');
const resetPasswordRoute = require('./routes/resetpass.route');

const { checkAuthentication } = require("./middlewares/auth.middleware.js");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/database.js");

// Database Connection
connectDB();

// Views
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication);

// Routes
app.use('/', staticRoute);
app.use('/user', userRoute);
app.use('/dashboard', checkAuthentication, dashboardRoute);
app.use('/r', redirectRoute);
app.use('/reset-password', resetPasswordRoute);
app.use('/url', urlRoute);

app.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
});