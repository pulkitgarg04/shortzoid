const dotenv = require("dotenv");
dotenv.config({
    path: './.env'
});

const express = require("express");
const app = express();

const path = require("path");

const urlRoute = require('./routes/url.route');
const staticRoute = require('./routes/static.route');
const userRoute = require('./routes/user.route');

const { loggedIn, checkAuthentication } = require("./middlewares/auth.middleware.js");

const cookieParser = require('cookie-parser');
const connectDB = require("./db/index.js");

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Error: ", error);
            throw error;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection FAILED!!! Error: ", err);
        process.exit(1);
    })

// Views
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication);

// Routes
app.use('/url', loggedIn, urlRoute);
app.use('/', checkAuthentication, staticRoute);
app.use('/user', userRoute);