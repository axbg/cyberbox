const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const filesController = require('../controllers/filesController');
const middlewares = require('../controllers/middlewares');

router.get('/get', middlewares.isFolder, filesController.getCurrentFolder);
router.get('/get/parents', filesController.parentFolders);
router.post('/create', filesController.createFolder);
router.get('/get/:folder_id', middlewares.isFolder, filesController.getFiles);

router.get('/back', filesController.navigateBack);
router.post('/access', filesController.changeAccess);

router.post('/upload', upload.array('fisiere'), filesController.uploadFiles);

router.post('/:owner_id', middlewares.PermissionChecker, filesController.publicParentFolders);
router.post('/delete', filesController.deleteFiles);
router.get('/download/:file_id', filesController.downloadFiles);

router.get('/get/friend/back/:friend_id', filesController.navigateBackFriend);

router.get('/get/friend/:owner_id/:folder_id', filesController.getFriendFiles);
router.get('/get/root/friend/:owner_id', filesController.getFriendFilesRoot);
router.get('/get/back/friend/:owner_id', filesController.navigateBackFriend);

router.post('/rename', filesController.renameFile);

router.get('/get/friend/download/:owner_id/:file_id', filesController.downloadFilesFriend);

module.exports = router;
