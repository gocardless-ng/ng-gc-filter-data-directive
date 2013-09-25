'use strict';

angular.module('gc.filterDataDirective', [
  'gc.clearFilterDataDirective'
]).directive('filterData', [
  '$location',
  function filterDataDirective($location) {

    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        // Get filter key - can be a string attr or parsed from an expression
        var filterKey = scope.$eval(attrs.filterData) || attrs.filterData;
        var isObject = angular.isObject(filterKey);
        if (isObject) {
          filterKey = Object.keys(filterKey)[0];
        }

        // Set initial form value if it exists in search params
        var value = $location.search()[filterKey];
        if (value) {
          ctrl.$setViewValue(value);
        }

        // Allows us to run the model value through a filter
        function getModelValue() {
          return isObject ? scope.$eval(attrs.filterData)[filterKey]
                          : ctrl.$modelValue;
        }

        // Cast undefined, null or '' to null
        function toNull(value) {
          return (value == null || value === '') ? null : value;
        }

        // Update the bound search param when the model value changes
        scope.$watch(function() {
          return ctrl.$modelValue;
        }, function() {
          $location.search(filterKey, toNull(getModelValue()));
        });

      }
    };

  }
]);
