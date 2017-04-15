var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/mainCtrl');
var authenticator = require('../config/passport');

router.get('/', authenticator.ensureAuthenticated, ctrlMain.index);

module.exports = router;
