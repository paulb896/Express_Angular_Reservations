
;'use strict';

/**
 * All controllers used for reservation tracking
 */

angular.module('reserveTheTime.place.controller', [])

.controller('placeController', ['$scope', 'UserSelection', 'PageState', 'placeService', function($scope, UserSelection, PageState, placeService) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.ratings = [1,2,3,4,5];

    $scope.getPlaceDetails = function(mapElement) {
        if (UserSelection.place
            && UserSelection.place.hasOwnProperty('reference')
        ) {
            placeService.details(UserSelection.place.reference).then(function(details) {
                UserSelection.place = details.result;

                var placeLatlng = new google.maps.LatLng(details.result.geometry.location.lat,details.result.geometry.location.lng);
                var mapOptions = {
                    zoom: 15,
                    center: placeLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(document.getElementById(mapElement),
                    mapOptions);

                var marker = new google.maps.Marker({
                    position: placeLatlng,
                    map: map,
                    title: UserSelection.place.name,
                    animation: google.maps.Animation.DROP
                });

//                var maps = document.getElementsByName("map-canvas");
//                console.log(maps);
//                var mapsArray = [document.getElementById("map-canvas"), ];
//                for (var i = 0; i < maps.length; i++) {
//                    mapsArray[i] = new google.maps.Map(maps[i],
//                        mapOptions);
//
//                    var marker = new google.maps.Marker({
//                        position: placeLatlng,
//                        map: mapsArray[i],
//                        title: UserSelection.place.name,
//                        animation: google.maps.Animation.DROP
//                    });
//                }

            });
        }
    };
}])