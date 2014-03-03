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
        console.log("Setting month", monthNumber);
        $scope.monthSelected = monthNumber;
        $scope.newSelectedDate = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber, $scope.UserSelection.selectedDate.getHours(), $scope.UserSelection.selectedDate.getMinutes());
        $scope.PageState.days = [];

        var daysAmount = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber, 0).getDate();
        if (daysAmount < 26) {
            var currentDate = new Date($scope.UserSelection.selectedDate);
            daysAmount = new Date(currentDate.getYear(), currentDate.getMonth()-1, 0).getDate();
        }

        $scope.PageState.days.push("S");
        $scope.PageState.days.push("M");
        $scope.PageState.days.push("T");
        $scope.PageState.days.push("W");
        $scope.PageState.days.push("T");
        $scope.PageState.days.push("F");
        $scope.PageState.days.push("S");

        // Add spacers for to set first day of week
        var selectedDate = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber, 1, 0);
        for(var j = 1; j <= selectedDate.getDay(); j++) {
            $scope.PageState.days.push("'");
        }

        for(var i = 1; i <= daysAmount; i++) {
            $scope.PageState.days.push(i);
        }
        $scope.newSelectedDate.setDate($scope.UserSelection.selectedDate.getDate());
        $scope.UserSelection.selectedDate = $scope.newSelectedDate;
        $scope.UserSelection.selectedDate.setMonth(monthNumber-1);
        $scope.updateReservations();
    };

    $scope.updateSelectedDay = function(day) {
        day = parseInt(day);
        if (!day) {
            return;
        }
        var newSelectedDate = new Date(UserSelection.selectedDate);
        newSelectedDate.setDate(day);
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

        var currentTime = new Date();
        if (!$scope.UserSelection.selectedDate) {
            console.log("setting sdasefe AAAAAAAAAAAAAAAAAAAAAAA");
            var currentMonth = currentTime.getMonth();
            console.log("There is no selected date: ", $scope.UserSelection.selectedDate);
            UserSelection.selectedDate = new Date();
            //$scope.setMonth(new Date().getMonth()+1);
        } else {
            console.log("SELSDFSDFEWV DATE: BBBBBBBBBBBBBBBBBBBB", $scope.UserSelection.selectedDate);
            var dateNew = new Date($scope.UserSelection.selectedDate);
            console.log("THIS IS DATE NEW: ", dateNew.getMonth()+1);
            $scope.setMonth(dateNew.getMonth()+1);
        }

        console.log("date initialized", $scope.UserSelection);
        //Draggable.create("#day-picker", {type:"y", edgeResistance:0.3, throwProps:true,bounds:{heigjt:600, bottom:100, left:0, top:-110}});
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