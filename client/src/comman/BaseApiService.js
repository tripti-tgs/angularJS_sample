angular.module('myApp')
  .constant('BASE_API_URL', 'http://localhost:5000') // your base URL
  .service('BaseApiService', ['$http', 'BASE_API_URL', function ($http, BASE_API_URL) {
    this.get = function (url, config) {
      return $http.get(BASE_API_URL + url, config);
    };

    this.post = function (url, data, config) {
      return $http.post(BASE_API_URL + url, data, config);
    };

    this.put = function (url, data, config) {
      return $http.put(BASE_API_URL + url, data, config);
    };

    this.delete = function (url, config) {
      return $http.delete(BASE_API_URL + url, config);
    };
  }]);
