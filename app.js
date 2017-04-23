var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dotenv = require('dotenv');
var winston = require('winston');

var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./app_server/routes/IndexRoutes');
var users = require('./app_server/routes/UserRoutes');
var sensorRoutesApi = require('./app_api/routes/SensorDataRoutes');
var weatherRoutesApi = require('./app_api/routes/WeatherDataRoutes');
var shadowRoutesApi = require('./app_api/routes/ShadowInteractionRoutes');

// initialise the application
var app = express();

// view engine setup
var viewsPath = path.join(__dirname, 'app_server', 'views');
app.set('views', viewsPath);
app.engine('handlebars', exphbs({defaultLayout: 'layout', layoutsDir: viewsPath + '/layouts'}));
app.set('view engine', 'handlebars');

// middleware for bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static folder
app.use(express.static(__dirname));

// Express Session middleware
app.use(session({
    secret: 'secret',
    cookie: {
        // 10 minute  cookie timeout
        maxAge: 600000
    },
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator middleware
// https://github.com/ctavan/express-validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/auth', users);
app.use('/api/sensordata', sensorRoutesApi);
app.use('/api/weatherdata', weatherRoutesApi);
app.use('/api/shadow', shadowRoutesApi);


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

dotenv.load();

winston.configure({
    transports: [
        //new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'application.log' })
    ]
});

var listener = app.listen(3001, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});


module.exports = app;