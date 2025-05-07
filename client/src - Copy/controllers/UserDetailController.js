angular.module('myApp')
.controller('UserDetailController', function($scope, $routeParams) {
  $scope.userId = $routeParams.id;

  $scope.$on('customEvent', function (event, data) {
    console.log('Child received:', data.message);
  });
});
