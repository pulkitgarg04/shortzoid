const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    shortID: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    qrcode: {
        type: String,
        required: true
    },
    visitHistory: [{
        timestamp: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        browser: {
            type: String,
            required: true
        },
        device: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const URL = mongoose.model("URL", urlSchema);
module.exports = URL;