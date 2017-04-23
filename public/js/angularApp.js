var app =
    angular.module("dashboard", ['chart.js'])
        .service('sharedProperties', function () {
            var id = '';
            var currentRoom1Light = '';
            var currentRoom1Temperature = '';
            var currentRoom2Temperature = '';
            var currentRoom2Humidity = '';


            return {
                getId: function () {
                    return id;
                },
                setId: function(value) {
                    id = value;
                },
                getCurrentRoom1Temperature: function () {
                    return currentRoom1Temperature.Current_Temperature;
                },
                setCurrentRoom1Temperature: function(value) {
                    currentRoom1Temperature = value;
                },
                getCurrentRoom1Light: function () {
                    return currentRoom1Light.Current_Temperature;
                },
                setCurrentRoom1Light: function(value) {
                    currentRoom1Light = value;
                },
                getCurrentRoom2Temperature: function () {
                    return currentRoom2Temperature.Current_Temperature;
                },
                setCurrentRoom2Temperature: function(value) {
                    currentRoom2Temperature = value;
                },
                getCurrentRoom2Humidity: function () {
                    return currentRoom2Humidity.Current_Humidity;
                },
                setCurrentRoom2Humidity: function(value) {
                    currentRoom2Humidity = value;
                }
            };
        })
        .factory('dataFactory', ['$http', function($http) {

            var urlBase = '/api';
            var dataFactory = {};

            dataFactory.weatherData = function () {
                return $http.get(urlBase + '/weatherdata/weather');
            };

            dataFactory.getRelayStates = function (userId) {
                return $http.get(urlBase + '/shadow/' + userId + '/getShadow');
            };

            dataFactory.changeRelayState = function (params, userId) {
                return $http({
                    method: 'POST',
                    data: params,
                    url: '/api/shadow/' + userId + '/updateShadow'});
            };


            dataFactory.room1LightData = function (userId) {
                return $http.get(urlBase + '/sensordata/room1/Light/' + userId)
            };

            dataFactory.room1TemperatureData = function (userId) {
                return $http.get(urlBase + '/sensordata/room1/Temp/' + userId)
            };

            dataFactory.room2TemperatureData = function (userId) {
                return $http.get(urlBase + '/sensordata/room2/Temp/' + userId)
            };

            dataFactory.room2HumidityData = function (userId) {
                return $http.get(urlBase + '/sensordata/room2/Humid/' + userId);
            };

            dataFactory.screenWidth = function ($window) {
                return ($window.innerWidth < 600);
            };

            return dataFactory;
        }]);



app.controller('mainController', function($scope, sharedProperties){
    $scope.id  = sharedProperties.getId();
    $scope.setString = function(id) {
        sharedProperties.setId(id);
        $scope.id = id;
    };
});


