//;'use strict';
//
//
//// Declare app level module which depends on filters, and services
//var reserveTheTime = angular.module('reserveTheTime', ['reserveTheTime.services', 'reserveTheTime.datePickerController', 'reserveTheTime.bannerController']);
//

'use strict';


// Declare app level module which depends on filters, and services
angular.module('reserveTheTime', [
    'reserveTheTime.directives',
    'reserveTheTime.services',
    'reserveTheTime.controllers.banner',
    'reserveTheTime.controllers.betterTimePicker',
    'reserveTheTime.controllers.datePicker',
    'reserveTheTime.controllers.hourChart',
    'reserveTheTime.controllers.placeSearch',
    'reserveTheTime.controllers.reservation',
    'reserveTheTime.controllers.tileNavigation',
    'reserveTheTime.place.controller',
    'reserveTheTime.filters']
    );