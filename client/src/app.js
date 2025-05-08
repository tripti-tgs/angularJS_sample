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
  })
  .service("CryptoService", function () {
    // Encrypt function
    this.encrypt = function (text) {
      return CryptoJS.AES.encrypt(text, window.__env.SECRET_KEY).toString();
    };

    // Decrypt function
    this.decrypt = function (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, window.__env.SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    };
  });
