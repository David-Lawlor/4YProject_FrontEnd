var express = require('express');
var router = express.Router();
var auth = require('../../app_server/config/Passport');

var sensorctl = require('../controllers/SensorDataCtrl');

// gets for each sensor
router.get('/:location/:sensor/:userId/' , auth.ensureAuthenticatedApi, sensorctl.sensordata);

// export routes to the router
module.exports = router;