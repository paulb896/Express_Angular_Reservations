'use strict'; // Date picker controller


angular.module('reserveTheTime.datePickerController', [])
.controller("datePickerController", ['$scope', 'PageState', 'UserSelection', function($scope, PageState, UserSelection) {
    $scope.currentState = {};
    $scope.data = {};

    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.setMonth = function(monthModel) {
        console.log("Attempt to set month: ", monthModel);
        console.log(PageState, UserSelection);
        $scope.PageState.currentDate.setMonth(1);
    };

    $scope.updateSelectedDay = function(days, day) {
      console.log("Attempt to select day", day);
        $scope.PageState.currentDate.setDate(22);

    };

    $scope.initializeSelectedDate = function() {
        UserSelection.selectedDate = new Date();
        PageState.currentDate = new Date();
        $scope.days = PageState.days;
        $scope.months = PageState.months;
        console.log("Initializing date information", PageState, UserSelection);
    };
}]);