app.controller("Room2Temp", function ($scope, dataFactory, $window, userId, sharedProperties) {

    $scope.labels = [];
    $scope.series = ['Series A'];
    $scope.message = "Preparing your data...";
    $scope.data = [];
    $scope.response = {};
    $scope.radioModel = 'Day';

    $scope.includeDesktopTemplate = false;
    $scope.includeMobileTemplate = false;

    var screenWidth = $window.innerWidth;

    if (screenWidth < 600){
        $scope.includeMobileTemplate = true;
    }else {
        $scope.includeDesktopTemplate = true;
    }

    $scope.dayData = function(){
        $scope.data = [$scope.response.data.Day.graphData];
        $scope.labels = $scope.response.data.Day.graphLabels;
    };

    $scope.monthData = function(){
        $scope.data = [$scope.response.data.Month.graphData];
        $scope.labels = $scope.response.data.Month.graphLabels;
    };

    dataFactory.room2TemperatureData(userId)
    // Simple GET request example:
        .then(function successCallback(response) {
            $scope.response = response;
            $scope.message = "Room 2 Temperature";
            $scope.data = [response.data.Day.graphData];
            $scope.labels = response.data.Day.graphLabels;
            sharedProperties.setCurrentRoom2Temperature(response.data.CurrentReading);
        }, function errorCallback(response) {
            console.log("error getting temperature data")
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

