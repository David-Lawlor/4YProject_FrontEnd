app.controller("Weather", function ($scope, $timeout, dataFactory) {

    dataFactory.weatherData()
    // Simple GET request example:
        .then(function successCallback(response) {
            $scope.message = "Weather";
            $scope.weatherIcon = "http://openweathermap.org/img/w/" + response.data.weather.icon + ".png";
            $scope.description = response.data.weather.description;
            $scope.minTemperature = response.data.temperature.temp_min;
            $scope.maxTemperature = response.data.temperature.temp_max;
            $scope.currentTemperature = response.data.temperature.temp;
            $scope.wind = response.data.wind.speed;

        }, function errorCallback(response) {
            console.log(response)
        });
});
