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
            PageState.session = Session.user();
            Session.user(function(data){
                //console.log("User data", data);
                PageState.session = data;
                console.log(PageState.session);
            });
        }
        //Session.user().get(function(data){
        //    console.log("User data", data);
        //});
//        Session.user().then(function(userData) {
//            console.log("User data", userData);
//        });
    };

}])
