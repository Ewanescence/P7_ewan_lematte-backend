const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const postCtrl = require('../controllers/post');

router.post('/publish', multer, postCtrl.createPost);
router.get('/posts', postCtrl.getAllPosts);

module.exports = router;