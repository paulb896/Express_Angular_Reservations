;'use strict';

/**
 * All controllers used for reservation tracking
 */

angular.module('reserveTheTime.controllers.banner', [])
/**
 * Controller that handles data preparation for display in page banners
 */
.controller('bannerController', ['$scope', '$timeout', 'UserSelection', 'PageState','Session', function($scope, $timeout, UserSelection, PageState, Session) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.startTime = function() {
        $timeout(function() {
            PageState.currentDate = new Date();
            $scope.startTime();
        }, 1000);
    };

    $scope.loadUser = function() {
        if (!PageState.hasOwnProperty('session')) {
            Session.user().then(function(data) {
                console.log("session data", data);
//                PageState = data[0];
//                PageState.session = data[0];
                console.log("session data", data);
                if (data[0].hasOwnProperty('session')) {
                    $scope.PageState.location = data[0].session.pageState.location;
                    $scope.PageState.selectedCityName = data[0].session.pageState.selectedCityName;
                    $scope.UserSelection.place = data[0].session.userSelection.place;
                }

                if (!PageState.hasOwnProperty('session')) {
                    PageState.session = {};
                }

                PageState.session.userProfile = data[0].userProfile;
            });
        }
    };

}])
