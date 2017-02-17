var express = require('express');
var router = express.Router();
var ctrlLogin = require('../controllers/login');

router.get('/register', ctrlLogin.register);
router.get('/login', ctrlLogin.login);


module.exports = router;
