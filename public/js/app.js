'use strict';


// Declare app level module which depends on filters, and services
angular.module('userCalendar', ['userCalendar.filters', 'userCalendar.services', 'userCalendar.directives', 'userCalendar.controllers']).
  config(['$routeProvider', function($routeProvider, $scope) {
    $routeProvider.when('/user', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
    $routeProvider.when('/calendar', {templateUrl: 'partials/calendar.html', controller: 'CalendarCtrl'});
    $routeProvider.otherwise({redirectTo: '/calendar'});
  }]);
