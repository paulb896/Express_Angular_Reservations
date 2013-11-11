;'use strict';

/**
 * Angular Controller that sets up and handles search requests
 */
angular.module('reserveTheTime.controllers.attendee', [])
/**
 * Controller that adding attendees to event
 */
.controller('attendeeController', ['$scope', 'UserSelection', 'PageState', 'Attendee', function($scope, UserSelection, PageState, Attendee) {
    $scope.PageState = PageState;
    $scope.UserSelection = UserSelection;

    /**
     * Send reservation notification email
     * @param attendee
     */
    $scope.sendEmailNotification = function(attendee) {
        Attendee.email(attendee);
    };

    /**
     * Add an attendee to the page state
     * @param attendee
     */
    $scope.addAttendee = function(attendee) {
        if (!attendee) {
            return;
        }
        PageState.attendees.push(attendee);
        UserSelection.attendee = "";
    };
}]);