const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#ca3e3eff'
    },
    icon: {
        type: String,
        default: 'folder'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    linkCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

folderSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
