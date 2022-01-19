const express = require('express');
const { readToken } = require('../config/token');
const { usersController } = require('../controllers');
const router = express.Router();

router.get('/get', usersController.getData);
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/keep-login', readToken, usersController.keepLogin);

module.exports = router