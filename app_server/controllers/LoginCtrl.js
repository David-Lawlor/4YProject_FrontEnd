var User = require("../model/User");
var auth = require('../../app_server/config/Passport');
var logger = require('winston');

module.exports.GetLogout = function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login')
};

module.exports.GetLogin = function(req, res) {
    if(req.user){
        return res.redirect('/');
    }
    res.render('login');
};

module.exports.PostLogin = function(req, res) {
    res.redirect('/');
};

module.exports.GetRegister = function(req, res) {
    if(req.user){
        return res.redirect('/');
    }
    res.render('register');
};

module.exports.PostRegister = function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.confirm;
    var mac = req.body.mac;

    req.checkBody('firstName', 'Name cannot be numbers').isAlpha();
    req.checkBody('firstName', 'Name is Required').notEmpty();
    req.checkBody('lastName', 'lastName cannot be numbers').isAlpha();
    req.checkBody('lastName', 'lastName is Required').notEmpty();
    req.checkBody("email", "Email is Required").notEmpty();
    req.checkBody("email", "Invalid email").isEmail();
    req.checkBody("password", "Password is Required").notEmpty();
    req.checkBody("password", "Password must be Alphanumeric").isAlphanumeric();
    req.checkBody("password", "Password must be 8 digits long").isLength(8);
    req.checkBody("mac", "Mac address must be valid").matches(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/, mac);
    req.checkBody("confirm", "Passwords do not match").equals(password);

    var errors = req.validationErrors();

    if(errors)
    {
        logger.log("error", "error in register form");
        res.render("register", {errors:errors});
    }
    else
    {
        var newUser = new User.User(email, password, firstName, lastName, mac);

        User.createUser(newUser, function (err, user)
        {
            if(err){
                req.flash('error_msg', 'User already exists');
                res.redirect("/users/register");
            }
            else{
                req.flash('success_msg', 'You are now registered');
                res.redirect("/users/login");
            }
        });
    }
};





