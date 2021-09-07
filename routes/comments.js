const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const commentCtrl = require('../controllers/comment');

router.post('/commenting', multer, commentCtrl.createComment);
router.get('/comments', commentCtrl.getAllComments);

module.exports = router;