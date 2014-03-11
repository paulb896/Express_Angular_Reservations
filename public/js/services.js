;'use strict';

/**
 * All services used for reservation tracking
 */
angular.module('reserveTheTime.services', [])


.factory('LocationResource', ['$resource', function($resource) {
    return $resource('/location?address=:address');
}])

.factory('LocationService', ['$q', 'LocationResource', function($q, LocationResource) {
    return function(params) {
        var defer = $q.defer();
        LocationResource.get(params, function(data) {
            defer.resolve(data);

        }, function(data) {
            defer.reject(data);
        });

        return defer.promise;
    };
}])

.factory('SessionResource', ['$resource', function($resource) {
    return $resource('/session');
}])

.factory('Session', ['$q', 'SessionResource', function($q, SessionResource) {
    var session = {
        get: function() {
            var defer = $q.defer();
            SessionResource.get(function(data) {
                defer.resolve(data);

            }, function(data) {
                defer.reject(data);
            });

            return defer.promise;
        }
    };
    return session;
}])
.factory('UserSelection', function(){
    return {
        "selectedDate": false,
        "place": null,
        "attendee":"",
        "city":"",
        "placeType":"store",
        "timePickerEnabled":false
    };
})
.value('version', '0.6')
.factory('PageState', function(){
    return {
        "selectedCityName":"Burnaby, BC",
        "cities":[{name:"Calgary"}, {name:"Burnaby"}],
        "placeTypesShort": [
            {name: "food", src:"img/food.png"},
            {name: "car_repair", src:"img/car-repair.png"},
            {name: "bank", src:"img/atm.png"},
            {name: "store", src:"img/store.png"}
        ],
        "placeTypes":["accounting","airport","amusement_park","aquarium","art_gallery","atm","bakery","bank","bar","beauty_salon","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground","car_dealer","car_rental","car_repair","car_wash","casino","cemetery","church","city_hall","clothing_store","convenience_store","courthouse","dentist","department_store","doctor","electrician","electronics_store","embassy","establishment","finance","fire_station","florist","food","funeral_home","furniture_store","gas_station","general_contractor","grocery_or_supermarket","gym","hair_care","hardware_store","health","hindu_temple","home_goods_store","hospital","insurance_agency","jewelry_store","laundry","lawyer","library","liquor_store","local_government_office","locksmith","lodging","meal_delivery","meal_takeaway","mosque","movie_rental","movie_theater","moving_company","museum","night_club","painter","park","parking","pet_store","pharmacy","physiotherapist","place_of_worship","plumber","police","post_office","real_estate_agency","restaurant","roofing_contractor","rv_park","school","shoe_store","shopping_mall","spa","stadium","storage","store","subway_station","synagogue","taxi_stand","train_station","travel_agency","university","veterinary_care","zoo"],
        "currentDate": "",
        "places":[],
        location: {
            lat: 49.2294908,
            lng: -123.0025753
        },
        "reservations":[],
        "times":[],
        "hourPickerEnabled": true,
        "attendees":[],
        "days" : ["S","M","T","W","T","F","S"],
        "chartHours": [13,14,15,16,17],
        "resultSetPage":0,
        "resultPageSize":7,
        "months": [{name:"J", fullName:"January", monthNumber:1},
            {name:"F", fullName:"February",monthNumber:2},
            {name:"M", fullName:"March",monthNumber:3},
            {name:"A", fullName:"April",monthNumber:4},
            {name:"M", fullName:"May",monthNumber:5},
            {name:"J", fullName:"June",monthNumber:6},
            {name:"J", fullName:"July",monthNumber:7},
            {name:"A", fullName:"August",monthNumber:8},
            {name:"S", fullName:"September",monthNumber:9},
            {name:"O", fullName:"October",monthNumber:10},
            {name:"N", fullName:"November",monthNumber:11},
            {name: "D", fullName:"December",monthNumber:12}
        ]
    };
})
.factory('placeService', function($http) {
    var placeService = {
        find: function(category, searchText, location) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get("/places?category="+category+"&searchText="+searchText+"&latitude="+location.lat+"&longitude="+location.lng).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                if (response.status == 200) {
                    return response.data;
                }

                return [];
            });

            // Return the promise to the controller
            return promise;
        },
        details: function(reference) {
            var promise = $http.get("/place-details?reference="+reference).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                if (response.status == 200) {
                    return response.data;
                }

                return [];
            });

            // Return the promise to the controller
            return promise;
        }
    };
    return placeService;
})
.factory('reservationSearch', function($http) {
    var service = {
        find: function(year, month, day) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get("/reservations?day="+day+"&month="+month+"&year="+year).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                if (response.status == 200) {
                    return response.data;
                }

                return [];
            });

            // Return the promise to the controller
            return promise;
        }
    };
    return service;
}).factory('Reservation', function($http) {
    var Reservation = {
        request: function(reservation) {
            console.log('Before reservation request post');
            // $http returns a promise, which has a then function, which also returns a promise

            //$http.jsonp()

            var promise = $http.post("/reserve", reservation).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log("response from post");
                console.log(response);
                // The return value gets picked up by the then in the controller.
                if (response.status == 200) {
                    return response.data;
                }

                return [];
            });

            // Return the promise to the controller
            return promise;
        }
    };
    return Reservation;
}).factory('Attendee', function($http, UserSelection) {
    var Attendee = {
        email: function(attendeeEmail) {
            var promise = $http.post("/notification",
                {
                    "email": attendeeEmail,
                    "date": UserSelection.selectedDate,
                    "place": UserSelection.place
                }).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log("response from post");
                console.log(response);
                // The return value gets picked up by the then in the controller.
                if (response.status == 200) {
                    return response.data;
                }

                return [];
            });

            // Return the promise to the controller
            return promise;
        }
    };
    return Attendee;
})
