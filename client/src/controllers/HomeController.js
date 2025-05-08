angular
  .module("myApp")
  .service("AllUserDataService", [
    "BaseApiService",
    function (BaseApiService) {
      this.getData = function (page, pageSize, Gender) {
        return BaseApiService.get(
          `/api/users?page=${page}&pageSize=${pageSize}&gender=${Gender}`
        );
      };
    },
  ])
  .controller(
    "HomeController",
    function ($scope, BaseApiService, AllUserDataService, $rootScope) {
      $scope.viewModel = false;
      $scope.emailMsgExists = false;
      $rootScope.formModel = false;
      $scope.selectedGender = "";
      $scope.gridOptions = {
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 10,
        paginationCurrentPage: 1,
        enableColumnMenus: false,
        rowHeight: 42,
        enableFiltering: true,
        enablePaginationControls: true,
        useExternalPagination: true,
        totalItems: 0,
        columnDefs: [
          {
            name: "S.No",
            displayName: "S.No",
            enableSorting: false,
            enableFiltering: false,
            cellTemplate:
              '<div class="ui-grid-cell-contents">' +
              "{{grid.options.paginationPageSize * (grid.api.pagination.getPage() - 1) + grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}" +
              "</div>",
            // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 80,
          },
          { name: "FirstName", headerCellClass: "custom-filter-header" },
          { name: "LastName" },
          { name: "Country" },
          { name: "State" },
          { name: "City" },
          { name: "ZipCode", width: 120 },
          {
            name: "Actions",
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: `<div class="ui-grid-cell-contents">
  <button ng-click="grid.appScope.viewRow(row.entity)" class="grid-btn view-btn">View</button>
  <button ng-click="grid.appScope.editRow(row.entity)" class="grid-btn edit-btn">Edit</button>
  <button ng-click="grid.appScope.deleteRow(row.entity)" class="grid-btn delete-btn">Delete</button>
</div>
`,
            width: 210,
          },
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.pagination.on.paginationChanged(
            $scope,
            function (newPage, pageSize) {
              loadUsers(newPage, pageSize, $scope.selectedGender);
            }
          );
        },
        data: [], // will be set later
      };

      function loadUsers(page, pageSize, Gender) {
        AllUserDataService.getData(page, pageSize, Gender)
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

      loadUsers(
        1,
        $scope.gridOptions.paginationPageSize,
        $scope.selectedGender
      );
      // Action functions
      $scope.filterByGender = function () {
        loadUsers(
          1,
          $scope.gridOptions.paginationPageSize,
          $scope.selectedGender
        );
      };
      $scope.viewRow = function (user) {
        $scope.selectedViewUser = user;
        $scope.viewModel = true;
      };

      $scope.closeModalUserDetails = function () {
        $scope.viewModel = false;
      };

      $scope.editRow = function (user) {
        $rootScope.formModel = true;
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
            $rootScope.showMessage(response.data, false);
          })
          .catch(function (error) {
            $rootScope.showMessage(error.data, true);
            console.error("Error deleting user: ", error);
          });
      };

      $scope.showToast = false;

      $rootScope.showMessage = function (message, isError) {
        $scope.messageAlert = isError ? message : message;
        $scope.showToast = true;

        // Auto-hide after 3 seconds
        setTimeout(function () {
          $scope.hideToast();
          $scope.$apply(); // needed to trigger digest cycle
        }, 3000);
      };

      $scope.hideToast = function () {
        $scope.showToast = false;
        $scope.messageAlert = null;
      };

      $scope.handleAddUser = function () {
        $rootScope.formModel = true;
        $scope.addUser = { Gender: "Male", MaritalStatus: false, Salary: 5000 };
        $scope.editUser = {};
        $scope.addnewUser = true;
        // Reset add form
      };

      $scope.$on("childToParentrecordData", function (event, args) {
        $scope.gridOptions.data.push(args.data); // Add a copy to grid
        $scope.addUser = { Gender: "Male", MaritalStatus: false, Salary: 5000 };
        $scope.editUser = {};
        loadUsers(
          1,
          $scope.gridOptions.paginationPageSize,
          $scope.selectedGender
        );
      });
      $scope.checkEmail = function (email) {
        if (!email) return;

        BaseApiService.post("/api/users/check-email", { email: email }).then(
          function (response) {
            if (response.data.exists) {
              $scope.emailExists = true;
            } else {
              $rootScope.formModel = true;
              $scope.emailMsgExists = false;
            }
          },
          function (error) {
            $rootScope.showMessage(error.data, true);
            console.error("Error checking email", error);
          }
        );
      };

      $scope.closeEmailModal = function () {
        $scope.emailExists = false;
        $scope.emailMsgExists = true;
      };

      // Fetch users and load into grid
      AllUserDataService.getData()
        .then(function (response) {
          // console.log(response.data);
          $scope.gridOptions.data = response.data.data || response.data; // adjust based on your API
        })
        .catch(function (error) {
          $rootScope.showMessage(error.data, true);
          console.error("Failed to fetch users:", error);
        });
    }
  )
  .controller(
    "UserController",
    function ($scope, BaseApiService, $rootScope, CryptoService) {
      $scope.passwordVisible = false;
      $rootScope.changeSaveExists = false;
      $scope.imageUrl = "images/no-image-available.webp";
      $scope.OriginalimageUrl = null;
      $scope.originalUser = null;

      $scope.states = [];
      $scope.cities = [];

      $scope.countries = [
        { id: 1, name: "USA" },
        { id: 2, name: "India" },
      ];

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

      // Initialize addUser object
      if ($scope?.editUser?.Id) {
        console.log($scope?.editUser);
        $scope.emailMsgExists = false;

        // Convert editUser to addUser with necessary transformations
        $scope.addUser = angular.copy($scope.editUser);
        // Convert birthday to 'yyyy-MM-dd' format for input type="date"
        if ($scope.addUser.Birthday) {
          $scope.addUser.Birthday = new Date($scope.addUser.Birthday);
        }
        $scope.addUser.Password = CryptoService.decrypt(
          $scope.addUser.Password
        );
        $scope.addUser.Gender = $scope.addUser.Gender == 1 ? "Female" : "Male";
        $scope.addUser.MaritalStatus =
          $scope.addUser.MaritalStatus == 1 ? true : false;
        // Convert salary to number
        $scope.addUser.Salary = parseFloat($scope.addUser.Salary);

        $scope.imageUrl = $scope.addUser.Photo || $scope.imageUrl;
        $scope.OriginalimageUrl = $scope.addUser.Photo || $scope.imageUrl;
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
          $scope.setCities(countryId, stateId);
        }
        if ($scope?.addUser?.City) {
          let selectedCity = $scope.cities.find(
            (city) => city.name == $scope?.addUser?.City
          );

          $scope.addUser.City = selectedCity?.id;
        }
        $scope.originalUser = angular.copy($scope.addUser);
      } else {
        $scope.addUser.Photo = null;
        $scope.OriginalimageUrl = $scope.imageUrl;
        $scope.originalUser = angular.copy($scope.addUser);
        $scope.addUser = angular.copy($scope.addUser);
      }
      // Toggle password visibility
      $scope.togglePasswordVisibility = function () {
        $scope.passwordVisible = !$scope.passwordVisible;
      };

      $scope.closeModal = function () {
        if ($scope.userForm.$dirty) {
          $rootScope.changeSaveExists = true;
        } else {
          $rootScope.changeSaveContinue();
        }
      };

      $rootScope.changeSaveContinue = function () {
        $rootScope.changeSaveExists = false;
        $rootScope.formModel = false;
      };

      $rootScope.changeSaveClose = function () {
        $rootScope.changeSaveExists = false;
      };
      $scope.restModel = function () {
        $scope.addUser = angular.copy($scope.originalUser);
        $scope.imageUrl = $scope.OriginalimageUrl;
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
      };

      window.onbeforeunload = function () {
        if ($scope.userForm.$dirty) {
          return "You have unsaved changes. Are you sure you want to leave?";
        }
      };
      $scope.$on("$locationChangeStart", function (event, next, current) {
        if ($scope.userForm.$dirty) {
          if (!confirm("You have unsaved changes. Continue without saving?")) {
            event.preventDefault();
          }
        }
      });
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
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.imageUrl = e.target.result;
              $scope.addUser.Photo = file;
            });
          };
          reader.readAsDataURL(file);
        }
      };

      // Save User (for example, post the data to an API)
      $scope.saveUser = function (action) {
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
            $rootScope.showMessage(
              { error: "User must be at least 18 years old." },
              true
            );

            return;
          }
          const date = new Date($scope.addUser.Birthday);
          const year = date.getFullYear();
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const day = ("0" + date.getDate()).slice(-2);
          $scope.addUser.Birthday = `${year}-${month}-${day}`;
        }

        $scope.addUser.Password = CryptoService.encrypt(
          $scope.addUser.Password
        );
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
            if (action == "close") {
              $scope.changeSaveContinue();
            } else if (action == "addNew") {
              $scope.imageUrl = "images/no-image-available.webp";
              $scope.states = [];
              $scope.cities = [];
              $scope.addUser = {
                Gender: "Male",
                MaritalStatus: false,
                Salary: 5000,
              };

              $scope.addnewUser = true;
              if ($scope.userForm) {
                $scope.userForm.$setPristine();
                $scope.userForm.$setUntouched();
              }
            }
            $scope.emailMsgExists = false;
            $scope.passwordVisible = false;
            $scope.$emit("childToParentrecordData", { data: $scope.addUser });
            $rootScope.showMessage(response.data, false);
          },
          function (error) {
            console.log(error);
            $rootScope.showMessage(error.data, true);
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
    }
  );
