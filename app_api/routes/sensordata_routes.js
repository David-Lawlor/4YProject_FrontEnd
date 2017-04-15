var express = require('express');
var router = express.Router();
var auth = require('../../app_server/config/passport');

var sensorctl = require('../controllers/sensordataCtrl');

// gets for each sensor
router.get('/:location/:sensor/:userId/:timePeriod' , sensorctl.sensordata);

// export routes to the router
module.exports = router;