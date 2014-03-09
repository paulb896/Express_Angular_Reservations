;'use strict';

/**
 * Angular Controller that sets up and handles search requests
 */
angular.module('reserveTheTime.controllers.placeSearch', [])
/**
 * Controller that handles place search requests
 */
.controller('placeSearchController', ['$scope', 'UserSelection', 'PageState', 'placeService', '$timeout','LocationService',
    function($scope, UserSelection, PageState, placeService, $timeout, LocationService) {

    $scope.searchPlaces = function(searchText) {
        console.log("SEARCH REQUEST, search text", searchText);
        Pace.start();
        placeService.find(UserSelection.placeType, searchText, PageState.location).then(function(placeData) {
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
        LocationService({address:city}).then(function(data) {
           if (data.hasOwnProperty('results')) {
               $scope.PageState.location = data.results[0].geometry.location;
               $scope.PageState.selectedCityName = data.results[0].formatted_address;
           }
        });
    };

    $scope.updatePlace = function(place) {
        if (!UserSelection.place ||  UserSelection.place.id != place.id) {
            UserSelection.place = place;
        }
    };

    $scope.updatePlaceType = function(searchText, placeType) {
        console.log("UPDATE PLACE", placeType, UserSelection.placeType);
        $scope.UserSelection.placeType = placeType;
        if (!searchText || !searchText.length) {
            console.log("SEARCHING WITH PLACE TYPE");
            $scope.searchPlaces(placeType.substr(0, placeType.charAt('_')));
        } else {
            $scope.searchPlaces(searchText);
        }
    };

    $scope.initialize = function() {
        $scope.$watch('placeSearch', function() {
            if ($scope.placeSearch && $scope.placeSearch.length > 3 && !$scope.updatingPlace) {
                $scope.updatingPlace = true;
                $timeout(function() {
                    $scope.searchPlaces($scope.placeSearch);
                    $scope.updatingPlace = false;
                }, 3000);
            }
        });

        $scope.$watch('UserSelection.city', function() {
            if ($scope.UserSelection.city && $scope.UserSelection.city.length > 4 && !$scope.updatingCity) {
                $scope.updatingCity = true;
                $timeout(function() {
                    $scope.updateCity($scope.UserSelection.city);
                    $scope.updatingCity = false;
                }, 3000);
            }
        });

        $scope.UserSelection = UserSelection;
        $scope.PageState = PageState;
    };
}]);