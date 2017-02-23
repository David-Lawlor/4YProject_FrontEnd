var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/mainCtrl');

router.get('/', ensureAuthenticated, ctrlMain.index);

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        res.redirect('/users/login');
    }
}

module.exports = router;
