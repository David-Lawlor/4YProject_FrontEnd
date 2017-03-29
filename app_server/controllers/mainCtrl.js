var http = require('http');

module.exports.index = function(req, res, next) {

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
    console.log(ip);

    var options = {
        host: 'freegeoip.net',
        path: '/json/' + ip,
        method: 'GET'
    };
    res.render('index', {
        username: req.user.username,
        ipaddress: ip
    });
};