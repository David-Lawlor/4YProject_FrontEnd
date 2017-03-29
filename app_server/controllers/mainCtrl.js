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

    var req1 = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

// write data to request body

    req1.write('data\n');
    req1.write('data\n');
    req1.end();
    res.render('index', {
        username: req.user.username,
        ipaddress: ip
    });
};