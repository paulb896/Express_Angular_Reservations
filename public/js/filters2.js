'use strict';

/* Filters */

angular.module('reserveTheTime.filters', [])
.filter('niceHour', [function(dateTime) {
    return function(dateTime) {
        var timeUnit = "am";
        var hour = dateTime.getHours();
        if (hour >= 11 && hour != 23) {
            timeUnit = "pm";
        }
        return ((hour % 12)+1) + timeUnit;
    }
}])
.filter('betterHour', [function(hour) {
    return function(hour) {
        var timeUnit = "am";
        if (hour >= 11 && hour != 23) {
            timeUnit = "pm";
        }
        return ((hour % 12)+1) + timeUnit;
    }
}])
.filter('niceDate', [function(dateTime) {
    return function(dateTime) {
        var minutes = dateTime.getMinutes();
        if (minutes < 10) {minutes = "0"+minutes;}

        return dateTime.getHours() + ":" + minutes;
    }
}])