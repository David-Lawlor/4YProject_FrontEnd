app.controller("Room1Light", function ($scope, $timeout, dataFactory, $window, userId, sharedProperties) {

    $scope.labels = [];
    $scope.series = ['Series A'];
    $scope.message = "Preparing your data...";
    $scope.data = [];
    $scope.response = {};

    $scope.includeDesktopTemplate = false;
    $scope.includeMobileTemplate = false;

    var screenWidth = $window.innerWidth;

    if (screenWidth < 600){
        $scope.includeMobileTemplate = true;
    }else {
        $scope.includeDesktopTemplate = true;
    }


    dataFactory.room1LightData(userId)
    // Simple GET request example:
        .then(function successCallback(response) {
            $scope.response = response;
            $scope.message = "Room 1 Light";
            $scope.data = [response.data.Day.graphData];
            $scope.labels = response.data.Day.graphLabels;
            sharedProperties.setCurrentRoom1Light(response.data.CurrentReading);
        }, function errorCallback(response) {
            console.log("error getting light data")
        });


    $scope.dayData = function(){
        $scope.data = [$scope.response.data.Day.graphData];
        $scope.labels = $scope.response.data.Day.graphLabels;
    };

    $scope.monthData = function(){
        $scope.data = [$scope.response.data.Month.graphData];
        $scope.labels = $scope.response.data.Month.graphLabels;
    };

    $scope.datasetOverride = [{yAxisID: 'y-axis-1'}];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
});
