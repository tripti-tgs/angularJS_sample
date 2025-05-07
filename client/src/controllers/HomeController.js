angular
  .module("myApp")
  .service("AllUserDataService", [
    "BaseApiService",
    function (BaseApiService) {
      this.getData = function (page, pageSize) {
        return BaseApiService.get(
          `/api/users?page=${page}&pageSize=${pageSize}`
        );
      };
    },
  ])
  .controller(
    "HomeController",
    function ($scope, BaseApiService, AllUserDataService, $timeout) {
      $scope.viewModel = false;
      $scope.gridOptions = {
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 10,
        paginationCurrentPage: 1,
        enableColumnMenus: false,
        rowHeight: 42,
        enablePaginationControls: true,
        useExternalPagination: true,
        totalItems: 0,
        columnDefs: [
          { name: "FirstName" },
          { name: "LastName" },
          { name: "Email" },
          {
            name: "Actions",
            cellTemplate: `<div class="ui-grid-cell-contents">
  <button ng-click="grid.appScope.viewRow(row.entity)" class="grid-btn view-btn">View</button>
  <button ng-click="grid.appScope.editRow(row.entity)" class="grid-btn edit-btn">Edit</button>
  <button ng-click="grid.appScope.deleteRow(row.entity)" class="grid-btn delete-btn">Delete</button>
</div>
`,
          },
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.pagination.on.paginationChanged(
            $scope,
            function (newPage, pageSize) {
              loadUsers(newPage, pageSize);
            }
          );
        },
        data: [], // will be set later
      };
      function loadUsers(page, pageSize) {
        AllUserDataService.getData(page, pageSize)
          .then(function (response) {
            $scope.gridOptions.data = response.data.data || response.data;
            $scope.gridOptions.paginationCurrentPage =
              response?.data?.pagination?.currentPage;
            $scope.gridOptions.totalItems =
              response?.data?.pagination?.totalRecords;
          })
          .catch(function (error) {
            console.error("Failed to fetch users:", error);
          });
      }

      loadUsers(1, $scope.gridOptions.paginationPageSize);
      // Action functions

      $scope.viewRow = function (user) {
        $scope.selectedViewUser = user;
        $scope.viewModel = true;
      };

      $scope.closeModal = function () {
        $scope.viewModel = false;
        $scope.formModel = false;
      };

      $scope.editRow = function (user) {
        $scope.formModel = true;
        $scope.editUser = user;
        $scope.addnewUser = false;
      };

      $scope.showDeleteModal = false;
      $scope.userToDelete = null;

      // Open the confirmation modal when deleting a user
      $scope.deleteRow = function (user) {
        $scope.userToDelete = user; // Set the user to be deleted
        $scope.showDeleteModal = true; // Show the confirmation modal
      };
      $timeout(function () {
        $scope.messageAlert = null;
      }, 10000);
      // Close the modal without deleting
      $scope.closeDeleteModal = function () {
        $scope.showDeleteModal = false;
        $scope.userToDelete = null;
      };

      // Confirm deletion and delete the row from the grid
      $scope.confirmDelete = function () {
        // Call your API to delete the user, if necessary
        BaseApiService.delete("/api/users/" + $scope.userToDelete.Id)
          .then(function (response) {
            // Remove the user from the grid data
            $scope.gridOptions.data = $scope.gridOptions.data.filter(
              (u) => u !== $scope.userToDelete
            );
            $scope.showDeleteModal = false;
            $scope.userToDelete = null; // Reset the user object
            $scope.messageAlert = response.data;
          })
          .catch(function (error) {
            console.error("Error deleting user: ", error);
          });
      };
      $scope.handleAddUser = function () {
        $scope.formModel = true;
        $scope.addUser = { Gender: "Male", MaritalStatus: false };
        $scope.editUser = {};
        $scope.addnewUser = true;
        // Reset add form
      };

      $scope.$on("childToParentrecordData", function (event, args) {
        $scope.gridOptions.data.push(args.data); // Add a copy to grid
        $scope.closeModal();
        $scope.addUser = { Gender: "Male", MaritalStatus: false };
        $scope.editUser = {};
        loadUsers(1, $scope.gridOptions.paginationPageSize);
      });

      // Fetch users and load into grid
      AllUserDataService.getData()
        .then(function (response) {
          // console.log(response.data);
          $scope.gridOptions.data = response.data.data || response.data; // adjust based on your API
        })
        .catch(function (error) {
          console.error("Failed to fetch users:", error);
        });
    }
  )
  .controller("UserController", function ($scope, BaseApiService) {
    $scope.countries = [
      { id: 1, name: "USA" },
      { id: 2, name: "India" },
    ];

    $scope.states = [];
    $scope.cities = [];

    $scope.setStates = function (countryId) {
      if (countryId == 1) {
        $scope.states = [
          { id: 1, name: "California" },
          { id: 2, name: "Texas" },
        ];
      } else if (countryId == 2) {
        $scope.states = [
          { id: 1, name: "Maharashtra" },
          { id: 2, name: "Karnataka" },
        ];
      } else {
        $scope.states = [];
      }
    };

    $scope.setCities = function (countryId, stateId) {
      if (stateId == 1 && countryId == 1) {
        $scope.cities = [
          { id: 1, name: "Los Angeles" },
          { id: 2, name: "San Francisco" },
        ];
      } else if (stateId == 2 && countryId == 1) {
        $scope.cities = [
          { id: 1, name: "Houston" },
          { id: 2, name: "Dallas" },
        ];
      } else if (stateId == 1 && countryId == 2) {
        $scope.cities = [
          { id: 1, name: "Maharashtra_1" },
          { id: 2, name: "Maharashtra_2" },
        ];
      } else if (stateId == 2 && countryId == 2) {
        $scope.cities = [
          { id: 1, name: "Karnataka_1" },
          { id: 2, name: "Karnataka_2" },
        ];
      } else {
        $scope.cities = [];
      }
    };

    $scope.imageUrl = "";
    // Initialize addUser object
    if ($scope?.editUser?.Id) {
      // Convert editUser to addUser with necessary transformations
      $scope.addUser = angular.copy($scope.editUser);
      // Convert birthday to 'yyyy-MM-dd' format for input type="date"
      if ($scope.addUser.Birthday) {
        $scope.addUser.Birthday = new Date($scope.addUser.Birthday);
      }
      $scope.addUser.Gender = $scope.addUser.Gender == 1 ? "Female" : "Male";
      $scope.addUser.MaritalStatus =
        $scope.addUser.MaritalStatus == 1 ? true : false;
      // Convert salary to number
      $scope.addUser.Salary = parseFloat($scope.addUser.Salary);

      $scope.imageUrl = $scope.addUser.Photo;

      // Convert Hobbies to array
      $scope.addUser.Hobbies = $scope.editUser.Hobbies
        ? $scope.editUser.Hobbies.split(",")
        : [];
      let countryId;
      if ($scope?.addUser?.Country) {
        let selectedCountry = $scope.countries.find(
          (country) => country.name == $scope?.addUser?.Country
        );
        $scope.addUser.Country = selectedCountry?.id;
        countryId = selectedCountry?.id;
        $scope.setStates(countryId);
      }

      if ($scope?.addUser?.State) {
        let selectedState = $scope.states.find(
          (state) => state.name == $scope?.addUser?.State
        );
        $scope.addUser.State = selectedState?.id;

        const stateId = selectedState?.id;
        console.log(countryId, stateId);
        $scope.setCities(countryId, stateId);
      }
      if ($scope?.addUser?.City) {
        let selectedCity = $scope.cities.find(
          (city) => city.name == $scope?.addUser?.City
        );

        $scope.addUser.City = selectedCity?.id;
      }
    } else {
      $scope.addUser = angular.copy($scope.addUser);
    }

    // Open the modal
    $scope.openModal = function () {
      $scope.formModel = true;
    };

    var dob = new Date($scope.addUser.Birthday);
    var today = new Date();
    $scope.today = new Date();
    $scope.isFutureDate = dob > today;

    // Check if the user is over 18 years old
    $scope.checkAge = function () {
      var dob = new Date($scope.addUser.Birthday);
      var today = new Date();
      // Check if future date

      var age = today.getFullYear() - dob.getFullYear();
      var month = today.getMonth() - dob.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      $scope.isUnder18 = age < 18;
    };

    $scope.uploadImage = function (file) {
      if (file) {
        $scope.addUser.Photo = file;
        var reader = new FileReader();
        reader.onload = function (e) {
          $scope.$apply(function () {
            $scope.imageUrl = e.target.result;
          });
        };
        reader.readAsDataURL(file);
      }
    };

    // Save User (for example, post the data to an API)
    $scope.saveUser = function () {
      if ($scope?.addUser?.Country) {
        let selectedCountry = $scope.countries.find(
          (country) => country.id == $scope?.addUser?.Country
        );
        $scope.addUser.Country = selectedCountry?.name;
      }

      if ($scope?.addUser?.State) {
        let selectedState = $scope.states.find(
          (state) => state.id == $scope?.addUser?.State
        );
        $scope.addUser.State = selectedState?.name;
      }
      if ($scope?.addUser?.City) {
        let selectedCity = $scope.cities.find(
          (city) => city.id == $scope?.addUser?.City
        );

        $scope.addUser.City = selectedCity?.name;
      }
      if ($scope.addUser.Birthday) {
        if ($scope.isUnder18) {
          alert("User must be at least 18 years old.");
          return;
        }
        const date = new Date($scope.addUser.Birthday);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        $scope.addUser.Birthday = `${year}-${month}-${day}`;
      }
      var formData = new FormData();
      for (var key in $scope.addUser) {
        if (
          $scope.addUser[key] !== null &&
          $scope.addUser[key] !== undefined &&
          $scope.addUser[key] !== ""
        ) {
          formData.append(key, $scope.addUser[key]);
        }
        //formData.append(key, $scope.addUser[key]);
      }
      // You can replace this with an actual API call

      let url = $scope.addnewUser
        ? BaseApiService.post("/api/users", formData, {
            headers: { "Content-Type": undefined },
            transformRequest: angular.identity,
          })
        : BaseApiService.put(`/api/users/${$scope.addUser.Id}`, formData, {
            headers: { "Content-Type": undefined },
            transformRequest: angular.identity,
          });
      url.then(
        function (response) {
          $scope.$emit("childToParentrecordData", { data: $scope.addUser });

          $scope.messageAlert = response.data;
          $scope.closeModal();
        },
        function (error) {
          console.log(error);
          $scope.messageAlert = error.data;
        }
      );
    };

    $scope.CountryChanged = function (countryId) {
      if (countryId) {
        $scope.setStates(countryId);
        $scope.addUser.State = null;
        $scope.addUser.City = null;
        $scope.cities = [];
      }
    };

    $scope.StateChanged = function (stateId) {
      const countryId = $scope.addUser.Country;
      if (stateId && countryId) {
        $scope.setCities(countryId, stateId);
        $scope.addUser.City = null;
      }
    };
  });
