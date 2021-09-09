const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const commentCtrl = require('../controllers/comment');

router.post('/comment/publish', multer, commentCtrl.createComment);
router.get('/comments/post', commentCtrl.getAllCommentsFrom);

router.delete('/comments/delete/user', commentCtrl.deleteAllCommentsFromUser);
router.delete('/comments/delete/post', commentCtrl.deleteAllCommentsFromPost);
router.delete('/comment/delete', commentCtrl.deleteComment);

module.exports = router;