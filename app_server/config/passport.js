var User = require("../model/user");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var configAuth = require('./auth');

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByEmail(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }));


passport.use(new GoogleStrategy({

        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: process.env.googleCallbackURL

    },
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.getUserByEmail(profile.emails[0].value, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    return done(null, err, {message: "You have not registered for this service"})
                }
            });
        });

    }));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports.ensureAuthenticated =  function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        res.redirect('/users/login');
    }
};

module.exports.ensureAuthenticatedApi =  function ensureAuthenticatedAPI(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        res.status(401);
        res.json('Api call not authorised');
    }
};

