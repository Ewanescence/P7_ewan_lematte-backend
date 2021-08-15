const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/user', userCtrl.authenticate);

module.exports = router;