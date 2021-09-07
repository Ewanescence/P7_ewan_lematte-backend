const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const postCtrl = require('../controllers/post');

router.post('/publish', multer, postCtrl.createPost);
router.get('/posts', postCtrl.getAllPosts);
router.get('/postsFrom', postCtrl.getAllPostsFrom);
router.get('/post', postCtrl.getOnePost);


module.exports = router;