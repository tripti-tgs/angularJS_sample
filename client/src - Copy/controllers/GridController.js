angular.module('myApp').controller('GridController', function ($scope) {
    $scope.gridOptions = {
      columnDefs: [
        { name: 'id' },
        { name: 'name' },
        { name: 'email' }
      ],
      data: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
      ]
    };
  });
  