var http = require('http');

module.exports.weather = function(req, res) {
    console.log("api weather data called");
    // var ip = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress;
    var ip = "78.18.55.12";

    var geoIpDetails = {
        host: 'freegeoip.net',
        path: '/json/' + ip,
        method: 'GET'
    };
    var apikey = process.env.weatherApiID;

    var geoIpRequest = http.request(geoIpDetails, function(geoIpResponse) {
        geoIpResponse.setEncoding('utf8');
        geoIpResponse.on('data', function (geoDetails, err ) {
            if (err){
                return err;
            }
            else{
                var geoDetailsJson = JSON.parse(geoDetails);
                var latitude = geoDetailsJson.latitude;
                var longitude = geoDetailsJson.longitude;

                var api_call = "http://api.openweathermap.org/data/2.5/weather?lat=" +
                    latitude + "&lon=" + longitude + "&units=metric&APPID=" + apikey;

                var weatherRequest = http.request(api_call, function (weatherResponse, err ){
                    if (err){
                        sendResponse(res, 404, {})
                    }
                    else {
                        weatherResponse.setEncoding('utf8');
                        weatherResponse.on('data', function (weatherDetails) {
                            var jsonWeatherDetails = JSON.parse(weatherDetails);
                            if(jsonWeatherDetails.cod != 200){
                                sendResponse(res, 404, "Weather data not found")
                            }
                            else{
                                var weatherResponse = {
                                    "weather": {
                                        "main": jsonWeatherDetails.weather[0].main,
                                        "description": jsonWeatherDetails.weather[0].description,
                                        "icon": jsonWeatherDetails.weather[0].icon
                                    },
                                    "temperature":{
                                        "temp_min" : jsonWeatherDetails.main.temp_min,
                                        "temp_max": jsonWeatherDetails.main.temp_max,
                                        "temp": jsonWeatherDetails.main.temp
                                    },
                                    "wind": {
                                        "speed": jsonWeatherDetails.wind.speed
                                    }
                                };
                                sendResponse(res, 200, weatherResponse)
                            }
                        });
                    }
                });
                weatherRequest.end();
            }
        });
    });
    geoIpRequest.end();
};

var sendResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};