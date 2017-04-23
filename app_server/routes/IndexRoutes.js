var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/MainCtrl');
var authenticator = require('../config/Passport');

router.get('/', authenticator.ensureAuthenticated, ctrlMain.index);

module.exports = router;
