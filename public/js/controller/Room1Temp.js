app.controller("Room1Temp", function ($scope, room1TemperatureData, $window) {

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.message = "Loading...";
    $scope.data = [];

    $scope.includeDesktopTemplate = false;
    $scope.includeMobileTemplate = false;

    var screenWidth = $window.innerWidth;

    if (screenWidth < 600){
        $scope.includeMobileTemplate = true;
    }else {
        $scope.includeDesktopTemplate = true;
    }

    room1TemperatureData
    // Simple GET request example:
        .then(function successCallback(response) {
            console.log(response);
            $scope.message = "Room 1 Temperature";
            $scope.data = [response.data.graphData];
            $scope.labels = response.data.graphLabels;
        }, function errorCallback(response) {
            console.log(response)
        });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };
});