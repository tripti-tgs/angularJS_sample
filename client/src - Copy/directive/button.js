angular.module("myApp").directive("myButton", function ($rootScope) {
  return {
    restrict: "E",
    scope: {
      buttonText: "@",
      buttonColor: "@",
      userID: "&",
      user: "<",
    },
    template: `
      <button class="my-button" ng-style="{'background-color': buttonColor}">
        {{ buttonText }}
      </button>
    `,
    link: function (scope, element, attrs) {
      element.on("click", function () {
        // console.log(scope?.user?.id);
        // if (scope.userId) {
        //   scope.userId({ user: scope.user }); // will run selectButtonUser(user)
        // }
        $rootScope.$emit("buttonClicked", { id: scope?.user?.id });
      });

      element.on("mouseover", function () {
        element.css("background-color", "darkblue");
      });

      element.on("mouseout", function () {
        element.css("background-color", scope.buttonColor || "blue");
      });
    },
  };
});
