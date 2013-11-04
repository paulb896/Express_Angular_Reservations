;'use strict';

/**
 * Angular Controller that sets up and handles search requests
 */
angular.module('reserveTheTime.controllers.hourChart', [])
/**
 * Controller that handles hour chart functionality
 */
.controller('hourChartController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', function($scope, UserSelection, PageState, reservationSearch) {
    $scope.PageState = PageState;
    $scope.UserSelection = UserSelection;

    $scope.initializeHours = function() {
        console.log("SDFEFESESFSE");
        $scope.updateReservations();
        if (!$scope.UserSelection.selectedDate) {
            $scope.UserSelection.selectedDate = new Date();
        }
        $scope.updateReservations();
    };

    $scope.updateReservations = function(){
        console.log("ATTEMPTING TO GET RESERVATIONS FOR", $scope.UserSelection.selectedDate);
        reservationSearch.find($scope.UserSelection.selectedDate.getFullYear(), $scope.UserSelection.selectedDate.getMonth(), $scope.UserSelection.selectedDate.getDate()).then(function(d) {
            // Send view an array of reservations for the current state
            console.log("RESERVATIONS RETURNED: ", d);
            $scope.PageState.reservations = d;
        });
    };


    $scope.updateSelectedMinute =function($event) {
        // I'm putting this in because I would like to avoid using jquery if possible
        UserSelection.selectedDate.setMinutes(Math.round(($event.offsetX / 629) * 60));

    };

    $scope.addAttendee = function(attendee) {
        PageState.attendees.push(attendee);
    };

    $scope.selectReservation = function(reservation) {
        console.log("RESERVATION HERE IS: ", reservation);
        if (reservation.hasOwnProperty('date')) {
            UserSelection.selectedDate = new Date(reservation.date);
        }

        if (reservation.place.hasOwnProperty('name')) {
            UserSelection.place = reservation.place;
        }

        if (reservation.attendees) {
            PageState.attendees = reservation.attendees;
        }
    };
}])