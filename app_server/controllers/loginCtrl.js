var User = require("../model/user");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports.GetLogout = function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login')
};

module.exports.GetLogin = function(req, res) {
    res.render('login');
};

module.exports.PostLogin = function(req, res) {
    console.log("post login");
    res.redirect('/');
};

module.exports.GetRegister = function(req, res) {
    res.render('register');
};

module.exports.PostRegister = function(req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.confirm;

    req.checkBody('name', 'Name cannot be numbers').isAlpha();
    req.checkBody('name', 'Name is Required').notEmpty();
    req.checkBody("email", "Email is Required").notEmpty();
    req.checkBody("email", "Invalid email").isEmail();
    req.checkBody("username", "Username is Required").notEmpty();
    req.checkBody("password", "Password is Required").notEmpty();
    req.checkBody("password", "Password must be Alphanumeric").isAlphanumeric();
    req.checkBody("password", "Password must be 8 digits long").isLength(8);


    req.checkBody("confirm", "Passwords do not match").equals(password);

    var errors = req.validationErrors();

    if(errors)
    {
        res.render("register", {errors:errors});
    }
    else
    {
        var newUser = new User(username, email, password, name);
        console.log(newUser);

        User.createUser(newUser, function (err, user)
        {
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are now registered');

        res.redirect("/users/login");
    }
};



passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});





