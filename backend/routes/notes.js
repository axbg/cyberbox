const router = require('express').Router();
const notesController = require('../controllers/notesController');

router.post('/create', notesController.createNote);
router.post('/delete', notesController.deleteNote);
router.get('/access/:note_id', notesController.changeAccess);

router.post('/create/folder', notesController.createNoteFolder);
router.post('/create/note', notesController.createNote);

router.get('/get/note/:note_id', notesController.getNote);
router.get('/get/note/all', notesController.getNotes);
router.get('/get/folder/root', notesController.getRoot);
router.get('/get/folder/current', notesController.getCurrent);
router.get('/get/folder/:folder_id', notesController.getFolder);
router.post('/edit/note', notesController.editNotes);

router.get('/get/friend/root/:owner_id', notesController.getFriendRoot);
router.get('/get/friend/note/:owner_id/:note_id', notesController.getActualNotes);
router.get('/get/friend/folder/:owner_id/:folder_id', notesController.getNotesFolder);

router.get('/get/raw/:note_id', notesController.rawNote);
router.get('/get/raw/:note_id/:owner_id', notesController.rawNoteFriend);

module.exports = router;
