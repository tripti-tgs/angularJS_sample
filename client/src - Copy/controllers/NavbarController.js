let app = angular.module("myApp");

app.controller("NavbarController", function ($scope, $rootScope) {
  try {
    $scope.selectedUserId = null;

    $rootScope.$on("buttonClicked", function (event, user) {
      console.log(user);
      $scope.selectedUserId = user.id;
    });
    // $rootScope.$on('userSelected', function (event, user) {
    //   console.log(user)
    //   $scope.selectedUserId = user.id;
    // });

  } catch (err) {
    console.log(err);
  }
});
