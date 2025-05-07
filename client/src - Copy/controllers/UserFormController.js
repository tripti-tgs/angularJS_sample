app.controller("UserFormController", function ($scope) {
  $scope.user = {};
  $scope.submitted = false;

  $scope.countries = ["India", "USA", "Canada", "UK", "Australia"];
  $scope.skills = ["JavaScript", "C#", "Python", "Java", "HTML/CSS"];

  $scope.submitForm = function () {
    if ($scope.userForm.$valid && $scope.user.termsAccepted) {
      $scope.submitted = true;
      console.log("Form submitted:", $scope.user);
    }
  };
});
