app.controller("Room2Temp", function ($scope, room2TemperatureData, $window) {

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A'];
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


    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    room2TemperatureData
    // Simple GET request example:
        .then(function successCallback(response) {
            $scope.message = "Room 2 Temperature";
            $scope.data = [response.data.graphData];
            $scope.labels = response.data.graphLabels;
        }, function errorCallback(response) {
            console.log(response)
        });

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

