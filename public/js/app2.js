//;'use strict';
//
//
//// Declare app level module which depends on filters, and services
//var reserveTheTime = angular.module('reserveTheTime', ['reserveTheTime.services', 'reserveTheTime.datePickerController', 'reserveTheTime.bannerController']);
//

'use strict';


// Declare app level module which depends on filters, and services
angular.module('reserveTheTime', ['reserveTheTime.services', 'reserveTheTime.controllers', 'reserveTheTime.place.controller', 'reserveTheTime.filters']);