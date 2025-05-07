angular.module("myApp", ["ngRoute", 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.exporter'])


  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/home.html",
        controller: "HomeController",
      })
      .when("/users", {
        templateUrl: "views/users/list.html",
        controller: "UserListController",
      })
      .when("/users/:id", {
        templateUrl: "views/users/detail.html",
        controller: "UserDetailController",
      })
      .when("/grid", {
        templateUrl: "views/users/grid.html",
        controller: "GridController",
      })
      .when("/user-form", {
        templateUrl: "views/users/user-form.html",
        controller: "UserFormController"
      })
      .otherwise({
        redirectTo: "/",
      });
  })

  .provider("Logger", function () {
    // Configurable settings
    var config = {
      debug: true,
      info: true,
      warn: true,
      error: true,
      prefix: "[AppLog]",
    };

    return {
      // Configuration methods
      enableDebug: function (val) {
        config.debug = val;
      },
      enableInfo: function (val) {
        config.info = val;
      },
      enableWarn: function (val) {
        config.warn = val;
      },
      enableError: function (val) {
        config.error = val;
      },
      setPrefix: function (p) {
        config.prefix = p;
      },

      // The actual logger service
      $get: function () {
        return {
          log: function (msg) {
            console.log(config.prefix + " " + msg);
          },
          debug: function (msg) {
            if (config.debug) {
              console.debug(config.prefix + " DEBUG: " + msg);
            }
          },
          info: function (msg) {
            if (config.info) {
              console.info(config.prefix + " INFO: " + msg);
            }
          },
          warn: function (msg) {
            if (config.warn) {
              console.warn(config.prefix + " WARN: " + msg);
            }
          },
          error: function (msg) {
            if (config.error) {
              console.error(config.prefix + " ERROR: " + msg);
            }
          },
        };
      },
    };
  })

  .config(function (LoggerProvider) {
    LoggerProvider.setPrefix("[MyApp]");
    // LoggerProvider.enableWarn("[hello.......]");
    // LoggerProvider.enableDebug(true);
    // LoggerProvider.enableInfo(true);
    // LoggerProvider.enableWarn(true);
    // LoggerProvider.enableError(true);
  })
  .run(function ($rootScope) {
    // Global variable available in all views/controllers
    $rootScope.appTitle = "AngularJS Demo App";
  });
