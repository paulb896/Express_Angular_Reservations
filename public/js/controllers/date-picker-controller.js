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
            $scope.PageState.days.push("-");
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

    $scope.updateChartHours = function(dateTime) {
        PageState.chartHours = [];
        var currentHour = dateTime.getHours(),
            endHour = currentHour + 3,
            startHour = currentHour - 2;

        // Set lowest shown hour
        if (startHour < 1) {
            startHour = 1;
            endHour = 6;
        }

        // Set highest show hour
        if (endHour > 23) {
            endHour = 23;
            startHour = endHour - 5;
        }

        for(var i = startHour; i < endHour; i++) {
            PageState.chartHours.push(i)
        }
    };

    $scope.updateSelectedMinute = function($event) {
        // I'm putting this in because I would like to avoid using jquery if possible
        UserSelection.selectedDate.setMinutes(Math.round(($event.offsetX / 390) * 60));
    };

    $scope.updateMin = function(minute) {
        minute = parseInt(minute, 10);
        if (minute >= 0 && minute <= 60) {
            $scope.$apply(function () {
                UserSelection.selectedDate.setMinutes(minute);
            });
        }
    };

    $scope.updateHour = function(hour) {
        hour = parseInt(hour, 10);
        if (hour >= 0 && hour <= 23) {
            $scope.$apply(function () {
                UserSelection.selectedDate.setHours(hour);
            });
        }
    };

    $scope.updateSelectedTime = function(dateTime) {
        $scope.updateChartHours(dateTime);
        var newSelectedDate = new Date(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), UserSelection.selectedDate.getDate(), dateTime.getHours()+1);
        UserSelection.selectedDate = newSelectedDate;
    };

    $scope.initializeDate = function() {
        $scope.PageState.currentDate = new Date();

        if (!$scope.UserSelection.selectedDate.hasOwnProperty("getDate")) {
            var currentTime = new Date();
            $scope.UserSelection.selectedDate = new Date(currentTime.getFullYear(), currentTime.getMonth());
            $scope.setMonth($scope.UserSelection.selectedDate.getMonth()+1);
        }

        $scope.PageState = PageState;
        $scope.UserSelection = UserSelection;
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