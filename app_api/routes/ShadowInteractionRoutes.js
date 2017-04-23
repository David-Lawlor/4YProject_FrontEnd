var express = require('express');
var router = express.Router();
var auth = require('../../app_server/config/Passport');

var shadowCtrl = require('../controllers/ShadowInteractionCtrl');

// gets for each sensor
router.post('/:userId/updateShadow' , auth.ensureAuthenticatedApi, shadowCtrl.updateShadow);

// gets for each sensor
router.get('/:userId/getShadow' , auth.ensureAuthenticatedApi, shadowCtrl.getShadow);

// export routes to the router
module.exports = router;