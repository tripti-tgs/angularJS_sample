angular
  .module("myApp")
  .service("DataService", [
    "$http",
    "Logger",
    function ($http, Logger) {
      this.getData = async function () {
        try {
          const response = await $http.get(
            "https://jsonplaceholder.typicode.com/posts"
          );
          return response.data;
        } catch (error) {
          Logger.error("Error fetching data in service:", error);
          throw error;
        }
      };
    },
  ])
  .controller("UserListController", [
    "$scope",
    "DataService",
    "$rootScope",
    "Logger",
    "$filter",
    function ($scope, DataService, $rootScope, Logger, $filter) {
      (async function () {
        try {
          const users = await DataService.getData();
          $scope.$applyAsync(() => {
            // $scope.searchText = "facere";
            // $scope.users = $filter("filter")(users, {
            //   title: $scope.searchText,
            // });
            $scope.users = users;
          });
          $scope.selectUser = function (user) {
            $rootScope.$emit("userSelected", user);
          };
          $scope.$on('customEvent', function (event, data) {
            console.log('Child received:', data.message);
          });
          Logger.log(`App title from $rootScope:${$rootScope.appTitle}`);
        } catch (error) {
          Logger.error("Error loading users in controller:", error);
        }
      })();
    },
  ])
  .filter("minLength", function () {
    return function (items, length) {
      if (!angular.isArray(items)) return items;
      return items.filter(function (item) {
        return item.id <= length;
      });
    };
  })
  .filter("customSearch", function () {
    return function (items, searchText) {
      if (!searchText) return items;
      searchText = searchText.toLowerCase();
      return items.filter(function (item) {
        return item.title.toLowerCase().includes(searchText);
      });
    };
  });
