const Folder = require('../models/folder.model.js');
const URL = require('../models/url.model.js');

async function getFolders(req, res) {
    try {
        const folders = await Folder.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        return res.json({ success: true, folders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function createFolder(req, res) {
    try {
        const { name, description, color } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Folder name is required' });
        }

        const existingFolder = await Folder.findOne({ 
            name: name.trim(), 
            createdBy: req.user._id 
        });

        if (existingFolder) {
            return res.status(400).json({ error: 'A folder with this name already exists' });
        }

        const folder = await Folder.create({
            name: name.trim(),
            description: description || '',
            color: color || '#6366f1',
            createdBy: req.user._id
        });

        return res.json({ success: true, folder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateFolder(req, res) {
    try {
        const { id } = req.params;
        const { name, description, color } = req.body;

        const folder = await Folder.findOne({ _id: id, createdBy: req.user._id });

        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        if (name && name.trim()) {
            const existingFolder = await Folder.findOne({ 
                name: name.trim(), 
                createdBy: req.user._id,
                _id: { $ne: id }
            });

            if (existingFolder) {
                return res.status(400).json({ error: 'A folder with this name already exists' });
            }
            folder.name = name.trim();
        }

        if (description !== undefined) folder.description = description;
        if (color) folder.color = color;

        await folder.save();

        return res.json({ success: true, folder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteFolder(req, res) {
    try {
        const { id } = req.params;

        const folder = await Folder.findOne({ _id: id, createdBy: req.user._id });

        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        await URL.updateMany(
            { folder: id, createdBy: req.user._id },
            { $set: { folder: null } }
        );

        await Folder.findByIdAndDelete(id);

        return res.json({ success: true, message: 'Folder deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getFolderWithLinks(req, res) {
    try {
        const { id } = req.params;

        const folder = await Folder.findOne({ _id: id, createdBy: req.user._id });

        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        const links = await URL.find({ folder: id, createdBy: req.user._id });

        return res.json({ success: true, folder, links });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function moveLinkToFolder(req, res) {
    try {
        const { linkId, folderId } = req.body;

        const link = await URL.findOne({ _id: linkId, createdBy: req.user._id });

        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        if (folderId) {
            const folder = await Folder.findOne({ _id: folderId, createdBy: req.user._id });
            if (!folder) {
                return res.status(404).json({ error: 'Folder not found' });
            }
        }

        if (link.folder) {
            await Folder.findByIdAndUpdate(link.folder, { $inc: { linkCount: -1 } });
        }

        if (folderId) {
            await Folder.findByIdAndUpdate(folderId, { $inc: { linkCount: 1 } });
        }

        link.folder = folderId || null;
        await link.save();

        return res.json({ success: true, link });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderWithLinks,
    moveLinkToFolder
};
