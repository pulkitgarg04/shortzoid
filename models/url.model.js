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
    customAlias: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values while maintaining uniqueness
    },
    redirectURL: {
        type: String,
        required: true
    },
    qrcode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: null
    },
    maxClicks: {
        type: Number,
        default: null // null -> unlimited
    },
    password: {
        type: String,
        default: null
    },
    isPasswordProtected: {
        type: Boolean,
        default: false
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    deepLinks: {
        ios: {
            appUrl: {
                type: String,
                default: null
            }, // e.g., myapp://path
            fallbackUrl: {
                type: String,
                default: null
            } // App Store URL
        },
        android: {
            appUrl: {
                type: String,
                default: null
            }, // e.g., intent://...
            fallbackUrl: {
                type: String,
                default: null
            } // Play Store URL
        }
    },
    isDeepLinkEnabled: {
        type: Boolean,
        default: false
    },
    visitHistory: [{
        timestamp: {
            type: Number,
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