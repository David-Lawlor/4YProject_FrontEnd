var app =
    angular.module("dashboard", ['chart.js'])
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
        })
        .factory('dataFactory', ['$http', function($http, sharedProperties) {

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
    $scope.id  = sharedProperties.getString();
    $scope.setString = function(id) {
        sharedProperties.setString(id);
        $scope.id = id;
    };
});


