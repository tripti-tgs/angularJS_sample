angular
  .module("myApp", [
    "ngRoute",
    "ui.grid",
    "ui.grid.pagination",
    "ui.grid.selection",
    "ui.grid.exporter",
    "ngFileUpload",
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/home.html",
        controller: "HomeController",
      })
      .otherwise({
        redirectTo: "/",
      });
  });
