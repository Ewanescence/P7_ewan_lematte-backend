const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const userCtrl = require('../controllers/user');

router.post('/user/register', userCtrl.register);
router.post('/user/login', userCtrl.login);

router.get('/user/auth', userCtrl.authenticate);
router.get('/user/owner', userCtrl.verifyOwner);
router.get('/user/', userCtrl.getProfile);

router.post('/user/logout', userCtrl.logout);

router.put('/user/picture', multer, userCtrl.changeProfilePicture);
router.put('/user/banner', multer, userCtrl.changeProfileBanner);
router.put('/user/update', userCtrl.updateProfile);

router.delete('/user/delete', userCtrl.deleteProfile);

module.exports = router;