;'use strict';

/**
 * Angular Controller that sets up date picker functionality
 */
angular.module('reserveTheTime.controllers.datePicker', [])
/**
 * Controller that handles date picker functionality
 */
.controller('datePickerController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', function($scope, UserSelection, PageState, reservationSearch) {
    $scope.setMonth = function(monthNumber) {
        $scope.newSelectedDate = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber, 0, $scope.UserSelection.selectedDate.getMinutes());
        $scope.PageState.days = new Array();

        var daysAmount = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber, 0, $scope.UserSelection.selectedDate.getMinutes()).getDate();
        $scope.PageState.days.push("S");
        $scope.PageState.days.push("M");
        $scope.PageState.days.push("T");
        $scope.PageState.days.push("W");
        $scope.PageState.days.push("T");
        $scope.PageState.days.push("F");
        $scope.PageState.days.push("S");

        // Add spacers for to set first day of week
        var selectedDate = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber-1, 1, 0);
        for(var j = 1; j <= selectedDate.getDay(); j++) {
            $scope.PageState.days.push("~");
        }

        for(var i = 1; i <= daysAmount; i++) {
            $scope.PageState.days.push(i);
        }
        $scope.newSelectedDate.setDate($scope.UserSelection.selectedDate.getDate());
        $scope.UserSelection.selectedDate = $scope.newSelectedDate;
        $scope.updateReservations();
    };

    $scope.updateSelectedDay = function(day) {
        day = parseInt(day);
        if (!day) {
            return;
        }
        var newSelectedDate = new Date(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), day);
        newSelectedDate.setMinutes(UserSelection.selectedDate.getMinutes());
        UserSelection.selectedDate = newSelectedDate;
        $scope.updateReservations();
    };

    $scope.updateSelectedTime = function(dateTime) {
        $scope.updateChartHours(dateTime);
        var newSelectedDate = new Date(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), UserSelection.selectedDate.getDate(), dateTime.getHours()+1);
        UserSelection.selectedDate = newSelectedDate;
    };

    $scope.initializeDate = function() {
        $scope.PageState = PageState;
        $scope.UserSelection = UserSelection;
        $scope.PageState.currentDate = new Date();

        if (!$scope.UserSelection.selectedDate.hasOwnProperty("getDate")) {
            var currentTime = new Date();
            $scope.UserSelection.selectedDate = new Date(currentTime.getFullYear(), currentTime.getMonth());
            $scope.setMonth($scope.UserSelection.selectedDate.getMonth()+1);
        }
    };

    $scope.updateReservations = function(){
        Pace.start();
        reservationSearch.find(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), UserSelection.selectedDate.getDate()).then(function(d) {
            // Send view an array of reservations for the current state
            PageState.reservations = d;
            Pace.stop();
        });
    };
}]);