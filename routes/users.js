const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/user', userCtrl.authenticate);
router.get('/getProfile', userCtrl.getProfile);
router.post('/author', userCtrl.getAuthorInfo);
router.post('/logout', userCtrl.logout);
router.post('/changeProfilePicture', multer, userCtrl.changeProfilePicture);
router.post('/changeProfileBanner', multer, userCtrl.changeProfileBanner);
router.put('/updateProfile', userCtrl.updateProfile);

module.exports = router;