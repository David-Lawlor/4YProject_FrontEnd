var app = angular.module("dashboard", ['chart.js']);

app.controller('mainController', function($scope){
    $scope.names = [
        { name: 'A'},
        { name: 'B'},
        { name: 'C'}
    ]
});

