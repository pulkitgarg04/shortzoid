const express = require('express');
const router = express.Router();
const { checkAuthentication } = require('../middlewares/auth.middleware.js');
const {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderWithLinks,
    moveLinkToFolder
} = require('../controllers/folder.controller.js');

router.use(checkAuthentication);

router.get('/', getFolders);

router.post('/', createFolder);

router.get('/:id', getFolderWithLinks);

router.put('/:id', updateFolder);

router.delete('/:id', deleteFolder);

router.post('/move-link', moveLinkToFolder);

module.exports = router;
