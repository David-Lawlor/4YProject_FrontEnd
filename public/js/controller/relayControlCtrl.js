app.controller("RelayControl", function ($scope, $http, sharedProperties, dataFactory, userId) {
    $scope.init = function () {
        $scope.relays = [];
        dataFactory.getRelayStates(userId)
        // Simple GET request example:
            .then(function successCallback(response) {
                var index = 0;
                angular.forEach(response.data.reported, function(value, key) {
                    $scope.relays[index] = value == 'ON';
                    index++;
                });
            }, function errorCallback(response) {
                console.log("error getting relay states")
            });
    };

    $scope.changeStatusBtn1 = function () {
        var stateToChange = $scope.getRelayStateName(0);
        var payload = { relay: 1, state: stateToChange};
        dataFactory.changeRelayState(payload, userId)
        .then(function successCallback(response) {
            $scope.relays[0] = !$scope.relays[0];
        }, function errorCallback(response) {
            alert("error changing relay state. Try again later");
        });
    };

    $scope.changeStatusBtn2 = function () {
        var stateToChange = $scope.getRelayStateName(1);
        var payload = { relay: 2, state: stateToChange};
        dataFactory.changeRelayState(payload, userId)
            .then(function successCallback(response) {
                $scope.relays[1] = !$scope.relays[1];
            }, function errorCallback(response) {
                alert("error changing relay state. Try again later");
            });
    };

    $scope.changeStatusBtn3 = function () {
        var stateToChange = $scope.getRelayStateName(2);
        var payload = { relay: 3, state: stateToChange};
        dataFactory.changeRelayState(payload, userId)
            .then(function successCallback(response) {
                $scope.relays[2] = !$scope.relays[2];
            }, function errorCallback(response) {
                alert("error changing relay state. Try again later");
            });
    };

    $scope.changeStatusBtn4 = function () {
        var stateToChange = $scope.getRelayStateName(3);
        var payload = { relay: 4, state: stateToChange};
        dataFactory.changeRelayState(payload, userId)
            .then(function successCallback(response) {
                $scope.relays[3] = !$scope.relays[3];
            }, function errorCallback(response) {
                alert("error changing relay state. Try again later");
            });
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

