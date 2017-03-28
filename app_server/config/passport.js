var User = require("../model/user");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var configAuth = require('./auth');

passport.use(new LocalStrategy(
    function (username, password, done) {
        var email = username;
        console.log(username, password);
        User.getUserByEmail(email, function (err, user) {
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
        var profileVerification = { 'email': profile.emails[0].value, 'token': token };
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function () {
            // try to find the user based on their google id
            //User.findOne({'google.id': profile.id}, function (err, user) {
            User.getUserByGoogleID(profileVerification, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    var newUser = new User.GoogleUser(profile.id, token, profile.displayName, profile.emails[0].value);
                    console.log(newUser);

                    User.createGoogleUser(newUser, function (err, user)
                    {
                        if(err) throw err;
                        console.log(user);
                    });
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
