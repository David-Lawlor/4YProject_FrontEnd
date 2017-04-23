var express = require('express');
var router = express.Router();
var auth = require('../../app_server/config/Passport');

var weatherCtrl = require('../controllers/WeatherDataCtrl');

// gets for each sensor
router.get('/weather', auth.ensureAuthenticatedApi,  weatherCtrl.weather);


// export routes to the router
module.exports = router;