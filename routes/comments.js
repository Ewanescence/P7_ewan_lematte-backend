const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');

router.post('/comment/publish', auth, multer, commentCtrl.createComment);
router.get('/comments/post', auth, commentCtrl.getAllCommentsFrom);

router.delete('/comments/delete/user', auth, commentCtrl.deleteAllCommentsFromUser);
router.delete('/comments/delete/post', auth, commentCtrl.deleteAllCommentsFromPost);
router.delete('/comment/delete', auth, commentCtrl.deleteComment);

module.exports = router;