;'use strict';

/**
 * All services used for reservation tracking
 */
angular.module('reserveTheTime.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]);