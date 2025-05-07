angular.module('myApp')
.controller('HomeController', function($scope,$rootScope,Logger) {
  $scope.message = "Welcome to the Home Page";
  $scope.selectedUserId = null;
  $scope.$on('customEvent', function (event, data) {
    console.log('Child received:', data.message);
  });
  
  // Logger.log("Plain log message");
  // Logger.debug("This is a debug message");
  // Logger.info("Some info to share");
  // Logger.warn("This is a warning");
  // Logger.error("Something went wrong");
});
