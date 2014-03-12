;'use strict';

/**
 * Angular controller that handles day/time picker toggle functionality
 */
angular.module('reserveTheTime.controllers.dayTimeToggle', [])
    /**
     * Controller that handles day/time picker toggle functionality
     */
    .controller('dayTimeToggleController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', function($scope, UserSelection, PageState, reservationSearch) {
        $scope.UserSelection = UserSelection;
    }]);