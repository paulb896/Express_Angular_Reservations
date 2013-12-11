;'use strict';

/**
 * All controllers used for reservation tracking
 */

angular.module('reserveTheTime.controllers.banner', [])
/**
 * Controller that handles data preparation for display in page banners
 */
.controller('bannerController', ['$scope', '$timeout', 'UserSelection', 'PageState', function($scope, $timeout, UserSelection, PageState) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.startTime = function() {
        $timeout(function() {
            PageState.currentDate = new Date();
            $scope.startTime();
        }, 1000);
    };
}])
