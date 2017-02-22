var express = require('express');
var router = express.Router();
var passport = require('passport');

var ctrlLogin = require('../controllers/loginCtrl');


router.get('/register', ctrlLogin.GetRegister);

router.post('/register', ctrlLogin.PostRegister);

router.get('/login', ctrlLogin.GetLogin);

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}));

router.get('/logout', ctrlLogin.GetLogout);


module.exports = router;
