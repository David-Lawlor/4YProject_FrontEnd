var express = require('express');
var router = express.Router();
var passport = require('passport');

var ctrlLogin = require('../controllers/loginCtrl');
var passportConfig = require('../config/passport');

router.get('/register', ctrlLogin.GetRegister);

router.post('/register', ctrlLogin.PostRegister);

router.get('/login', ctrlLogin.GetLogin);

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}));

router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/google/callback',
    passport.authenticate('google', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}));

router.get('/logout', ctrlLogin.GetLogout);


module.exports = router;

