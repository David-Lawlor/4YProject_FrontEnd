var getRelayStates = function ($http, sharedProperties) {
    return $http({
        method: 'GET',
        url: '/api/shadow/' + sharedProperties.getString() + '/getShadow'
    });
};

var changeRelayState = function ($http, sharedProperties) {
    return {
        update: function(params) {
            $http({
                method: 'POST',
                data: params,
                url: '/api/shadow/' + sharedProperties.getString() + '/updateShadow'
            });
        }
    }
};

var room1LightData = function ($http, sharedProperties) {
    return $http({
        method: 'GET',
        url: '/api/sensordata/room1/Light/' + sharedProperties.getString()
    });
};

var room1TemperatureData = function ($http, sharedProperties) {
    return $http({
        method: 'GET',
        url: '/api/sensordata/room1/Temp/' + sharedProperties.getString()
    });
};

var room2TemperatureData = function ($http, sharedProperties) {
    return $http({
        method: 'GET',
        url: '/api/sensordata/room2/Temp/' + sharedProperties.getString()
    });
};

var room2HumidityData = function ($http, sharedProperties) {
    return $http({
        method: 'GET',
        url: '/api/sensordata/room2/Humid/' + sharedProperties.getString()
    });
};

var weatherData = function ($http) {
    return $http({
        method: 'GET',
        url: '/api/weatherdata/weather'
    });
};


var screenWidth = function ($window) {
    return ($window.innerWidth < 600);
};

var app =
    angular.module("dashboard", ['chart.js'])
        .service('room1LightData', room1LightData)
        .service('room1TemperatureData', room1TemperatureData)
        .service('room2TemperatureData', room2TemperatureData)
        .service('room2HumidityData', room2HumidityData)
        .service('screenWidth',  screenWidth)
        .service('Weather',  weatherData)
        .service('relayStates',  getRelayStates)
        .service('changeRelayState',  changeRelayState)
        .service('sharedProperties', function () {
            var id = '';

            return {
                getString: function () {
                    return id;
                },
                setString: function(value) {
                    id = value;
                }
            };
        });


app.controller('mainController', function($scope, sharedProperties){
    $scope.id  = sharedProperties.getString();
    $scope.setString = function(id) {
        sharedProperties.setString(id);
        $scope.id = id;
    };
});


