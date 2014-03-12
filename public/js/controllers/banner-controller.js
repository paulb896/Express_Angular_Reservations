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
//                PageState = data[0];
//                PageState.session = data[0];
                if (!data.hasOwnProperty(0)
                    || !data[0].hasOwnProperty('session')
                ) {
                    return;
                }

                PageState = data[0].session.pageState;
                UserSelection = data[0].session.userSelection;
                if (!PageState.hasOwnProperty('session')) {
                    PageState.session = {};
                }
                PageState.session.userProfile = data[0].session.userProfile;
            });
        }
    };

}])
