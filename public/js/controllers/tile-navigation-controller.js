;'use strict';

/**
 * All controllers used for reservation tracking
 */

angular.module('reserveTheTime.controllers.tileNavigation', [])
/**
 * Controller that handles data preparation for display in page banners
 */
.controller('tileNavigationController', ['$scope', 'UserSelection', 'PageState', '$rootScope', function($scope, UserSelection, PageState, $rootScope) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.updateNav = function(template){
        $scope.template = template;
    };

    $scope.initializeNav = function(navNumber) {
        // Bind templates specific to this controllers scope
        $rootScope.templates =
            [{ name: 'Date Picker', url: 'partials/tile-date-picker.html', imageUrl:"img/calendar.png",
                completed:function() {
                    return true
                }
            }
                , { name: 'Time Picker', url: 'partials/tile-time-picker.html', imageUrl:"img/clock-nav.png",
                completed:function() {
                    return PageState.attendees.length < 1;
                }
            }
                , { name: 'Place Search', url: 'partials/tile-place-search.html', imageUrl:"img/find2.png",
                completed:function() {
                    return UserSelection.place
                }
            }
                , { name: 'Place Details', url: 'partials/tile-place-details.html', imageUrl:"img/map-icon.png",
                completed:function() {
                    return UserSelection.place
                }
            }
                , { name: 'User', url: 'partials/tile-user.html', imageUrl:"img/user.png",
                completed:function() {
                    return false;
                }
            }
                , { name: "Calendar", url: 'partials/tile-hour-chart.html', imageUrl:"img/calendar-nav.png",
                completed:function() {
                    return true;
                }
            }
            ];

        $scope.template = $rootScope.templates[navNumber || 0];
    };

    $scope.isComplete = function() {
        return true;
    };
}])