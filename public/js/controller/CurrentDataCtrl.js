app.controller("CurrentData", function ($scope, $timeout, sharedProperties) {
    $scope.title = "Loading current data readings...";

    setInterval(function(){
        $scope.title = "Current Readings";
        $scope.currentRoom1Light = sharedProperties.getCurrentRoom1Light();
        $scope.currentRoom1Temperature = sharedProperties.getCurrentRoom1Temperature();
        $scope.currentRoom2Temperature = sharedProperties.getCurrentRoom2Temperature();
        $scope.currentRoom2Humidity = sharedProperties.getCurrentRoom2Humidity();

        if($scope.currentRoom1Temperature >= 18){
            $scope.room1TempImageUrl = '/public/images/Thermometer-warm.png';
        }
        else{
            $scope.room1TempImageUrl = '/public/images/Thermometer-cool.png';
        }
        if($scope.currentRoom2Temperature >= 18){
            $scope.room2TempImageUrl = '/public/images/Thermometer-warm.png';
        }
        else{
            $scope.room2TempImageUrl = '/public/images/Thermometer-cool.png';
        }
        if($scope.currentRoom1Light >= 100){
            $scope.room1LightImageUrl = '/public/images/light-bright.png';
        }
        else{
            $scope.room1LightImageUrl = '/public/images/light-bright.png';
        }
        $scope.room2HumidImageUrl = '/public/images/Humidity.png'
    }, 5000)
});

