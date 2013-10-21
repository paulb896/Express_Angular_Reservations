'use strict';

/* Filters */

angular.module('userCalendar.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('extractDay', [function(dateTime) {
    return function(dateTime) {
      return dateTime;
      var date = new Date(dateTime);
      return String(date.getDate());
    }
  }])
  .filter('monthName', [function(monthNumber) {
    return function(monthNumber) {
      var monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];

      return monthNames[monthNumber];
    }
  }])
  .filter('dayOfWeek', [function(date) {
    return function(date) {
        var weekday=new Array(7);
        weekday[0]="Sunday";
        weekday[1]="Monday";
        weekday[2]="Tuesday";
        weekday[3]="Wednesday";
        weekday[4]="Thursday";
        weekday[5]="Friday";
        weekday[6]="Saturday";

      return weekday[date.getDay()];
    }
  }])
  .filter('getChartPosition', [function(dateTime) {
    return function(dateTime) {
      //console.log("Using this datetime to determine chart position: " + dateTime);
      var dateTime = new Date(dateTime);
      //console.log("AND THE HOURS IN TIME ARE: ");
      //console.log(dateTime.getHours());
      //return (dateTime.getHours() * 60) + dateTime.getMinutes();
      return (dateTime.getHours() * 60);
    }
  }])
  .filter('niceTime', [function(time) {
    return function(time) {
      //console.log("Using this datetime to determine chart position: " + dateTime);
      var dateTime = new Date(time),
      minutes = dateTime.getMinutes();
      if (minutes < 10) {minutes = "0"+minutes;}

      return dateTime.getHours() + ":" + minutes;
    }
  }])
  .filter('minuteWidth', [function(width) {
    return function(width) {
        return width * 20;
    }
  }])
  .filter('reservationState', [function(requestedTime) {
      return function(requestedTime) {
          if (!requestedTime
              || !requestedTime.hasOwnProperty("x")
              && !requestedTime.hasOwnProperty("date")
          ) {
              return "hidden";
          }

          return "";
      }
  }])
.filter('updateState', [function(requestedTime) {
    return function(requestedTime) {
        if (requestedTime
            && !requestedTime.hasOwnProperty("modified")
            ) {
            return "hidden";
        }
        return "";
    }
}])