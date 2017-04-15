app.controller("Room1Light", function ($scope, $timeout, room1LightData, $window) {

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


    room1LightData
    // Simple GET request example:
        .then(function successCallback(response) {
            $scope.message = "Room 1 Light";
            $scope.data = [response.data.graphData];
            $scope.labels = response.data.graphLabels;
        }, function errorCallback(response) {
            console.log(response)
        });

    // $timeout(function () {
    //     room1LightData
    //     // Simple GET request example:
    //         .then(function successCallback(response) {
    //             $scope.message = "Room 1 Light";
    //             $scope.data = response.data;
    //         }, function errorCallback(response) {
    //             console.log(response)
    //         });
    // }, 10000);


    $scope.onClick = function (points, evt) {
        console.log(points, evt);
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
