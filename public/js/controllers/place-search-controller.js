;'use strict';

/**
 * Angular Controller that sets up and handles search requests
 */
angular.module('reserveTheTime.controllers.placeSearch', [])
/**
 * Controller that handles place search requests
 */
.controller('placeSearchController', ['$scope', 'UserSelection', 'PageState', 'placeService', function($scope, UserSelection, PageState, placeService) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.searchPlaces = function(searchText) {
        console.log("SEARCH REQUEST, search text", searchText);
        Pace.start();
        placeService.find(UserSelection.placeType, searchText).then(function(placeData) {
            // Send view an array of reservations for the current state
            //$scope.selectedDate.reservations = d;
            console.log("Data from place search: ", placeData);
            PageState.places = placeData.results;
            Pace.stop();
        });
    };

    /**
     * Update the current city search param
     * @param string city
     */
    $scope.updateCity = function(city) {
        UserSelection.city = city;
    };


    $scope.updatePlace = function(place) {
        UserSelection.place = place;
    };

    $scope.updatePlaceType = function(searchText, placeType) {
        UserSelection.placeType = placeType;
        if (!searchText || !searchText.length) {
            console.log("SEARCHING WITH PLACE TYPE");
            $scope.searchPlaces(placeType.substr(0, placeType.charAt('_')));
        } else {
            $scope.searchPlaces(searchText);
        }
    };

    $scope.initialize = function() {
        $scope.$watch('placeSearch', function() {
            if ($scope.placeSearch && $scope.placeSearch.length > 3) {
                $scope.searchPlaces($scope.placeSearch);
            }
        });
    };
}]);