app.controller("RelayControl", function ($scope, relayStates, $http, sharedProperties, changeRelayState) {

    $scope.init = function () {
        $scope.relays = [];
        relayStates
        // Simple GET request example:
            .then(function successCallback(response) {
                console.log(response);
                var index = 0;
                angular.forEach(response.data.reported, function(value, key) {
                    console.log(index + "   " + key + ': ' + value);
                    $scope.relays[index] = value == 'ON';
                    index++;
                });
            }, function errorCallback(response) {
                console.log(response)
            });
    };

    $scope.changeStatusBtn1 = function () {
        var stateToChange = $scope.getRelayStateName(0);
        $http({
            method: 'POST',
            data: { relay: 1, state: stateToChange},
            url: '/api/shadow/' + sharedProperties.getString() + '/updateShadow'
        }).then(function successCallback(response) {
            $scope.relays[0] = !$scope.relays[0];
        }, function errorCallback(response) {
            alert("error changing relay state. Try again later");
        });
    };

    $scope.changeStatusBtn2 = function () {
        $scope.relays[1] = !$scope.relays[1];
    };

    $scope.changeStatusBtn3 = function () {
        $scope.relays[2] = !$scope.relays[2];
    };

    $scope.changeStatusBtn4 = function () {
        $scope.relays[3] = !$scope.relays[3];
    };

    $scope.getRelayStateName = function(index){
        if($scope.relays[index] == true){
            return 'OFF';
        }
        else {
            return 'ON'
        }
    }
});

