var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlLogin = require('../controllers/login')

router.get('/', ctrlLogin.index);



module.exports = router;
