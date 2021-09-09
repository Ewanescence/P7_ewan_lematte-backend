const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const postCtrl = require('../controllers/post');

router.post('/post/publish', multer, postCtrl.createPost);
router.get('/posts', postCtrl.getAllPosts);
router.get('/posts/user', postCtrl.getAllPostsFrom);
router.get('/post', postCtrl.getOnePost);
router.get('/post/author', postCtrl.getAuthorInfo)

router.delete('/post/delete', postCtrl.deletePost);
router.delete('/posts/delete/user', postCtrl.deleteAllPostsFromUser);


module.exports = router;