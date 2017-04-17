var express = require('express');
var router = express.Router();
var auth = require('../../app_server/config/passport');

var shadowCtrl = require('../controllers/shadowCtrl');

// gets for each sensor
router.get('/:userId' , shadowCtrl.interact);

// export routes to the router
module.exports = router;