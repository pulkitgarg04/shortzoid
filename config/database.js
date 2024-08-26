const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch(err) {
        console.log("MongoDB connection FAILED!!! Error: ", err);
        process.exit(1);
    }
}

module.exports = connectDB;