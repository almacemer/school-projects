const express = require('express');
const usersController = require('../controllers/usersController');

usersController.serializeUser();
usersController.deserializeUser();
usersController.authentication();

const router = express.Router();

router.post('/login/password', usersController.loginUser);

router.post('/logout', usersController.logoutUser);

router.get('/register', usersController.notAuth, usersController.renderForRegister);

router.post('/register', usersController.registerUser);

module.exports = router;
