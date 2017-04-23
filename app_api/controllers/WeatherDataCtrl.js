var http = require('http');
var responseCreator = require('./ResponseCreator');
var logger = require('winston');


module.exports.weather = function(req, res) {
    logger.log("info", "api weather data called");
    var ip = //req.headers['x-forwarded-for']// ||
        req.connection.remoteAddress; //||
        //req.socket.remoteAddress;

    var geoIpDetails = {
        host: 'freegeoip.net',
        path: '/json/' + ip,
        method: 'GET'
    };
    var apikey = process.env.weatherApiID;

    logger.log("info", "calling geo ip api", geoIpDetails);
    var geoIpRequest = http.request(geoIpDetails, function(geoIpResponse) {
        geoIpResponse.setEncoding('utf8');
        geoIpResponse.on('data', function (geoDetails, err ) {
            if (err){
                logger.log("error", "error in response from geoip", err);
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
                        logger.log("error", "error in response from openweathermap", err);
                        responseCreator.sendResponse(res, 404, {})
                    }
                    else {
                        weatherResponse.setEncoding('utf8');
                        weatherResponse.on('data', function (weatherDetails) {
                            var jsonWeatherDetails = JSON.parse(weatherDetails);
                            if(jsonWeatherDetails.cod != 200){
                                logger.log("error", "response from openweathermap is not 200 ok");
                                responseCreator.sendResponse(res, 404, "Weather data not found")
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
                                responseCreator.sendResponse(res, 200, weatherResponse)
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