;'use strict';

/**
 * Angular Controller that allows user to chose an hour, minute and toggle between AM and PM
 */
angular.module('reserveTheTime.controllers.betterTimePicker', [])
/**
 * Controller that handles better time picker functionality
 */
.controller('betterTimePickerController', ['$scope', 'UserSelection', 'PageState',
  function($scope, UserSelection, PageState) {
    /**
     * Setup page.
     */
    $scope.initializeTime = function() {
        $scope.PageState = PageState;
        $scope.UserSelection = UserSelection;

        if ($scope.UserSelection.selectedDate) {
            var selectedDate = new Date($scope.UserSelection.selectedDate);
            $scope.setSelectedHour(selectedDate.getHours());
            $scope.setSelectedMinute(selectedDate.getMinutes());
            $scope.setHourPicker();
        } else if ($scope.PageState.currentDate) {
            var selectedDate = new Date();
            $scope.setSelectedHour(selectedDate.getHours());
            $scope.setSelectedMinute(selectedDate.getMinutes());
            $scope.setHourPicker();
        }

        Draggable.create("#better-time-picker", {type:"y", edgeResistance:0.3, throwProps:true,bounds:{height:600, bottom:0, left:0, maxY:250, minY:0}});
    };

    $scope.clearTimeCircle = function() {
        PageState.times = [];
    };

    /**
     * Initialize hours for time picker.
     */
    $scope.setHourPicker = function()
    {
        PageState.hourPickerEnabled = true;
        $scope.clearTimeCircle();
        var items = 12;
        for(var i = 1; i <= items; i++) {
            var x = 100 - 12 + 104 * Math.cos(2 * Math.PI * i / items - (Math.PI/2) );
            var y = 100 - 12 + 104 * Math.sin(2 * Math.PI * i / items - (Math.PI/2) );
            PageState.times.push({x: x, y:y, value: i});
        }
    };

    /**
     * Initialize minutes for time picker.
     */
    $scope.setMinutePicker = function()
    {
        PageState.hourPickerEnabled = false;
        $scope.clearTimeCircle();
        var items = 12;
        for(var i = 0; i < items; i++) {
            var x = 100 - 12 + 104 * Math.cos(2 * Math.PI * i / items - (Math.PI/2)),
            y = 100 - 12 + 104 * Math.sin(2 * Math.PI * i / items - (Math.PI/2)),
            value = i *5;
            PageState.times.push({x: x, y:y, value: value});
        }
    };

    /**
     * Toggle selected time between AM and PM
     */
    $scope.toggleAmPm = function()
    {
        var hour = $scope.UserSelection.selectedDate.getHours() + 12;
        if (hour > 23) {
            hour = hour - 23;
        }
        $scope.UserSelection.selectedDate.setHours(hour);
    }

    /**
     * Set hour/minute depending on time picker state.
     * @param int time
     */
    $scope.setSelectedTime = function(time) {
        if (PageState.hourPickerEnabled) {
            $scope.setSelectedHour(time);
        } else {
            $scope.setSelectedMinute(time);
        }
        $scope.clearTimeCircle();
    };

    /**
     * Set hour/minute depending on time picker state.
     * @param int hour
     */
    $scope.setSelectedHour = function(hour) {
        $scope.UserSelection.selectedDate.setHours(hour);
        $scope.clearTimeCircle();
    };

    /**
     * Set hour/minute depending on time picker state.
     * @param int minute
     */
    $scope.setSelectedMinute = function(minute) {
        $scope.UserSelection.selectedDate.setMinutes(minute);
        $scope.clearTimeCircle();
    };
}]);