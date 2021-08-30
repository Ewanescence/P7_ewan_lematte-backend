const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/user', userCtrl.authenticate);
router.post('/author', userCtrl.getAuthorInfo);
router.post('/logout', userCtrl.logout);

module.exports = router;