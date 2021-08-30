const express = require('express');

const router = express.Router();

const postCtrl = require('../controllers/post');

router.post('/publish', postCtrl.createPost);
router.get('/posts', postCtrl.getAllPosts);

module.exports = router;