// let app = angular.module("myApp");

app.controller('IndexController', function ($scope) {
    $scope.broadcastMessage = function () {
      $scope.$broadcast('customEvent', { message: 'Hello from parent!' });
    };
  });
  
