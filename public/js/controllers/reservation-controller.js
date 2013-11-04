;'use strict';

/**
 * Angular Controller that sets up and handles search requests
 */
angular.module('reserveTheTime.controllers.reservation', [])
/**
 * Controller that handles hour chart functionality
 */
.controller('reservationController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', 'Reservation', function($scope, UserSelection, PageState, reservationSearch, Reservation) {
    $scope.PageState = PageState;
    $scope.UserSelection = UserSelection;

    $scope.reserve = function(){
        console.log("Attempting to request time: ");
        if (Pace) Pace.start();
        var reservation = {
            date:UserSelection.selectedDate,
            status:"pending",
            duration: UserSelection.duration,
            place:UserSelection.place,
            day:UserSelection.selectedDate.getDate(),
            month:UserSelection.selectedDate.getMonth(),
            year:UserSelection.selectedDate.getFullYear(),
            attendees:PageState.attendees
        };

        Reservation.request(reservation).then(function(responseMessage) {
            // Set success/failure message

            console.log("Reservation request complete, with response: ");
            console.log(responseMessage);
            if (Pace) Pace.stop();
        });
    }
}])