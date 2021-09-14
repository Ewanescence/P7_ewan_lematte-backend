const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');

router.post('/post/publish', auth, multer, postCtrl.createPost);
router.get('/posts', auth, postCtrl.getAllPosts);
router.get('/posts/user', auth, postCtrl.getAllPostsFrom);
router.get('/post', auth, postCtrl.getOnePost);
router.get('/post/author', auth, postCtrl.getAuthorInfo)

router.delete('/post/delete', auth, postCtrl.deletePost);
router.delete('/posts/delete/user', auth, postCtrl.deleteAllPostsFromUser);


module.exports = router;