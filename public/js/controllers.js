
;'use strict';

/**
 * All controllers used for reservation tracking
 */

angular.module('reserveTheTime.controllers', [])
/**
 * Controller that handles data preparation for display in page banners
 */
.controller('bannerController', ['$scope', 'UserSelection', 'PageState', function($scope, UserSelection, PageState) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;
}])

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
            [{ name: 'Hourly Chart', url: 'partials/tile-date-picker.html', imageUrl:"img/clock.png",
                completed:function() {
                    return true
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
                , { name: 'Reserve', url: 'partials/tile-user.html', imageUrl:"img/user.png",
                completed:function() {
                    return false;
                }
            }
                , { name: 'Attendees', url: 'partials/tile-attendees.html', imageUrl:"img/add-user-icon.png",
                completed:function() {
                    return PageState.attendees.length < 1;
                }
            }
                , { name: "Calendar", url: 'partials/tile-hour-chart.html', imageUrl:"img/calendar.png",
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
/**
 * Controller that handles place search requests
 */
.controller('placeSearchController', ['$scope', 'UserSelection', 'PageState', 'placeService', function($scope, UserSelection, PageState, placeService) {
    $scope.UserSelection = UserSelection;
    $scope.PageState = PageState;

    $scope.searchPlaces = function(searchText) {
        console.log("SEARCH REQUEST, search text", searchText);
        Pace.start();
        placeService.find(UserSelection.placeType, searchText).then(function(d) {
            // Send view an array of reservations for the current state
            //$scope.selectedDate.reservations = d;
            console.log("Data from place search: ", d);
            PageState.places = d.results;
            Pace.stop();
        });
    };

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


}])
/**
 * Controller that handles date picker functionality
 */
.controller('datePickerController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', function($scope, UserSelection, PageState, reservationSearch) {
    $scope.PageState = PageState;
    $scope.UserSelection = UserSelection;

    $scope.setMonth = function(monthNumber) {
        var newSelectedDate = new Date($scope.UserSelection.selectedDate.getFullYear(), monthNumber, 0, $scope.UserSelection.selectedDate.getMinutes());
        $scope.PageState.days = new Array();
        for(var i = 1; i <= newSelectedDate.getDate(); i++) {
            PageState.days.push(i);
        }
        newSelectedDate.setDate(UserSelection.selectedDate.getDate());
        $scope.UserSelection.selectedDate = newSelectedDate;
        $scope.updateReservations();
    };

    $scope.updateSelectedDay = function(day) {
        var newSelectedDate = new Date(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), day);
        newSelectedDate.setMinutes(UserSelection.selectedDate.getMinutes());
        UserSelection.selectedDate = newSelectedDate;
        $scope.updateReservations();
    };

    $scope.updateChartHours = function(dateTime) {
      PageState.chartHours = [];
      var currentHour = dateTime.getHours(),
      endHour = currentHour + 3,
      startHour = currentHour - 2;

      // Set lowest shown hour
      if (startHour < 1) {
          startHour = 1;
          endHour = 6;
      }

      // Set highest show hour
      if (endHour > 23) {
          endHour = 23;
          startHour = endHour - 5;
      }

      for(var i = startHour; i < endHour; i++) {
        PageState.chartHours.push(i)
      }
    };

    $scope.updateSelectedMinute =function($event) {
        // I'm putting this in because I would like to avoid using jquery if possible
        UserSelection.selectedDate.setMinutes(Math.round(($event.offsetX / 629) * 60));

    };

    $scope.updateSelectedTime = function(dateTime) {
        $scope.updateChartHours(dateTime);
        var newSelectedDate = new Date(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), UserSelection.selectedDate.getDate(), dateTime.getHours()+1);
        UserSelection.selectedDate = newSelectedDate;
    };

    $scope.setTimes = function() {
        PageState.times = new Array();
        for(var i = 0; i <= 23; i++) {
            var timeIndicator = new Date();
            timeIndicator.setHours(i);
            PageState.times.push(timeIndicator);
        }
    };

    $scope.initializeDate = function() {
        $scope.PageState.currentDate = new Date();

        if (!$scope.UserSelection.selectedDate) {
            $scope.UserSelection.selectedDate = new Date();
            $scope.setMonth($scope.UserSelection.selectedDate.getMonth()+1);
            console.log("DATE initialized");
        }
        $scope.setTimes();

    };

    $scope.updateReservations = function(){
        Pace.start();
        reservationSearch.find(UserSelection.selectedDate.getFullYear(), UserSelection.selectedDate.getMonth(), UserSelection.selectedDate.getDate()).then(function(d) {
            // Send view an array of reservations for the current state
            PageState.reservations = d;
            Pace.stop();
        });
    };
}])
/**
 * Controller that handles hour chart functionality
 */
.controller('hourChartController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', function($scope, UserSelection, PageState, reservationSearch) {
    $scope.PageState = PageState;
    $scope.UserSelection = UserSelection;

    $scope.initializeHours = function() {
        console.log("SDFEFESESFSE");
        $scope.updateReservations();
        if (!$scope.UserSelection.selectedDate) {
            $scope.UserSelection.selectedDate = new Date();
        }
        $scope.updateReservations();
    };

    $scope.updateReservations = function(){
        console.log("ATTEMPTING TO GET RESERVATIONS FOR", $scope.UserSelection.selectedDate);
        reservationSearch.find($scope.UserSelection.selectedDate.getFullYear(), $scope.UserSelection.selectedDate.getMonth(), $scope.UserSelection.selectedDate.getDate()).then(function(d) {
            // Send view an array of reservations for the current state
            console.log("RESERVATIONS RETURNED: ", d);
            $scope.PageState.reservations = d;
        });
    };


    $scope.updateSelectedMinute =function($event) {
        // I'm putting this in because I would like to avoid using jquery if possible
        UserSelection.selectedDate.setMinutes(Math.round(($event.offsetX / 629) * 60));

    };

    $scope.addAttendee = function(attendee) {
        PageState.attendees.push(attendee);
    };

    $scope.selectReservation = function(reservation) {
      console.log("RESERVATION HERE IS: ", reservation);
      if (reservation.hasOwnProperty('date')) {
          UserSelection.selectedDate = new Date(reservation.date);
      }

      if (reservation.place.hasOwnProperty('name')) {
          UserSelection.place = reservation.place;
      }

      if (reservation.attendees) {
          PageState.attendees = reservation.attendees;
      }
    };
}])
/**
 * Controller that handles hour chart functionality
 */
.controller('reservationController', ['$scope', 'UserSelection', 'PageState', 'reservationSearch', 'Reservation', function($scope, UserSelection, PageState, reservationSearch, Reservation) {
    $scope.PageState = PageState;
    $scope.UserSelection = UserSelection;

    $scope.reserve = function(){
        console.log("Attempting to request time: ");
        if (Pace) Pace.start();
        var reservation = {
            date:UserSelection.selectedDate,
            status:"pending",
            duration: UserSelection.duration,
            place:UserSelection.place,
            day:UserSelection.selectedDate.getDate(),
            month:UserSelection.selectedDate.getMonth(),
            year:UserSelection.selectedDate.getFullYear(),
            attendees:PageState.attendees
        };

        Reservation.request(reservation).then(function(responseMessage) {
            // Set success/failure message

            console.log("Reservation request complete, with response: ");
            console.log(responseMessage);
            if (Pace) Pace.stop();
        });
    }
}])
/**
 * Controller that handles hour chart functionality
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