let express = require('express');
let router = express.Router();
let filesController = require('../public/controllers/filesController');
let middlewares = require('../public/controllers/middlewares');
let multer = require('multer');
let storage = multer.memoryStorage();
let upload = multer({storage: storage});

router.get("/get", middlewares.isFolder, filesController.getCurrentFolder);
router.get("/get/parents", filesController.parentFolders);
router.post("/create", filesController.createFolder);
router.get("/get/:folder_id", middlewares.isFolder, filesController.getFiles);

router.get("/back", filesController.navigateBack);
router.post("/access", filesController.changeAccess);

router.post("/upload", upload.array('fisiere'), filesController.uploadFiles);

router.post("/public/:owner_id", middlewares.PermissionChecker, filesController.publicParentFolders);
router.post("/delete", filesController.deleteFiles);
router.get("/download/:file_id", filesController.downloadFiles);

router.get("/get/friend/back/:friend_id", filesController.navigateBackFriend);

router.get("/get/friend/:owner_id/:folder_id", filesController.getFriendFiles);
router.get("/get/root/friend/:owner_id", filesController.getFriendFilesRoot);
router.get("/get/back/friend/:owner_id", filesController.navigateBackFriend);

router.post("/rename", filesController.renameFile);

router.get('/get/friend/download/:owner_id/:file_id', filesController.downloadFilesFriend);

module.exports = router;