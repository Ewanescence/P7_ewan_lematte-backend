const express = require('express');

const router = express.Router();

const postCtrl = require('../controllers/post');

router.get('/', postCtrl.createPost);

module.exports = router;