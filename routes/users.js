const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer'); // importation de la gestion d'image entrante
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.post('/user/register', userCtrl.register);
router.post('/user/login', userCtrl.login);

router.get('/user/auth', auth, userCtrl.getUserData);
router.get('/user/owner', auth, userCtrl.verifyOwner);
router.get('/user/', auth, userCtrl.getProfile);

router.post('/user/logout', auth, userCtrl.logout);

router.put('/user/picture', auth, multer, userCtrl.changeProfilePicture);
router.put('/user/banner', auth, multer, userCtrl.changeProfileBanner);
router.put('/user/update', auth, userCtrl.updateProfile);

router.delete('/user/delete', auth, userCtrl.deleteProfile);

module.exports = router;