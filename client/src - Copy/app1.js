// app.js
// var app = angular.module("myApp", []);
var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      template: '<h2>Home Page</h2><p>Welcome to the Home Page!</p>',
      controller: 'HomeCtrl'
    })
    .when('/about', {
      template: '<h2>About Page</h2><p>About our application</p>',
      controller: 'AboutCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
});

app.controller('HomeCtrl', function($scope) {
  $scope.message = 'Welcome to Home!';
});

app.controller('AboutCtrl', function($scope) {
  $scope.message = 'This is the About Page!';
});


// app.factory("MathFactory", function () {
//   return {
//     square: function (x) {
//       return x * x;
//     },
//     cube: function (x) {
//       return x * x * x;
//     },
//   };
// });

// app.controller("factory",function($scope,MathFactory){
//     $scope.number = 5;
//     $scope.square = MathFactory.square($scope.number);
//     $scope.cube = MathFactory.cube($scope.number);
// })


// app.controller("MainController", function ($scope) {
//   $scope.name = "AngularJS-test";
// });
// app.controller("MainController1", function ($scope) {
//   $scope.name = "test";
// });

// app.controller("myFrom", function ($scope) {
//   $scope.firstName = "John";
//   $scope.lastName = "Doe";
//   $scope.fullName = function () {
//     return $scope.firstName + " " + $scope.lastName;
//   };
// });

// app.controller("list", function ($scope) {
//   $scope.names = [
//     {
//       name: "Jani",
//       country: "Norway",
//     },
//     {
//       name: "hege",
//       country: "Sweden",
//     },
//     {
//       name: "kai",
//       country: "Denmark",
//     },
//   ];
// });
