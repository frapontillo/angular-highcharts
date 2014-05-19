'use strict';

angular.module('frapontillo.highcharts.directives')

  /**
   * @ngdoc directive
   * @name frapontillo.highcharts.directives.directive:chart
   * @requires $filter
   * @requires $log
   * @requires $timeout
   * @requires frapontillo.highcharts.services.$chartDefaults
   * @restrict E
   * @scope
   *
   * @description
   * Directive to build HighChart charts according to the specified parameters.
   *
   * @param {string=} options The options configuration object name.
   * @param {string=} default A default configuration name (see {@link frapontillo.highcharts.constants.constant:SPARKLINE_DEFAULT}).
   * @param {string=} hiddenSeries Name of the array of series indexes that will be hidden hide in the chart.
   */
  .directive('chart', function ($filter, $log, $timeout, $chartDefaults) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        default: '@',
        hiddenSeries: '='
      },

      link: function (scope, element, attrs) {
        var chart;

        /**
         * Consolidate the visible items with the object scope.hiddenSeries.
         * This will be called every time the chart is redrawn.
         *
         * @param {object} event The original event.
         */
        var redrawCallback = function (event) {
          var series = event.currentTarget.series;
          var hiddenItems = [];
          // Push all of the invisible items
          for (var s in series) {
            if (!series[s].visible) {
              hiddenItems.push(s);
            }
          }
          // If the new array is different than the old one, edit the scope variable
          if (!angular.equals(scope.hiddenSeries, hiddenItems)) {
            $timeout(function() {
              angular.copy(hiddenItems, scope.hiddenSeries);
              // Since the event is called outside of AngularJS, we have to apply the changes
              scope.$apply();
            });
          }
        };

        /**
         * Consolidate the series visibility
         */
        var showHideSeries = function () {
          if (!chart || !scope.hiddenSeries) {
            return;
          }
          // Loop through the chart series
          for (var s in chart.series) {
            // Show or hide the series in scope.hiddenSeries
            var show = !($filter('filter')(scope.hiddenSeries, s).length);
            chart.series[s].setVisible(show, false);
          }
          chart.redraw();
        };

        /**
         * Loop over exporting button callbacks and wrap them with scope.$apply().
         *
         * All of the buttons functions are triggered by HighCharts, so they are executed outside of AngularJS.
         * Every function defined by the user must be followed by scope.$apply().
         *
         * @param {object} chartOptions The chart options.
         */
        var setScopeApplyToFns = function (chartOptions) {
          if (!chartOptions || !chartOptions.exporting) {
            return;
          }
          angular.forEach(chartOptions.exporting.buttons, setScopeRec);
        };

        /**
         * Wrap every callback function of the given button inside of a scope.$apply() so it can get executed
         * inside AngularJS.
         *
         * @param {object} button The button to wrap functions for.
         */
        var setScopeRec = function (button) {
          if (!button) {
            return;
          }
          if (button.onclick) {
            button.onclick = (function () {
              var _a = button.onclick;
              return function () {
                var originalResult = _a.apply(this, arguments);
                scope.$apply();
                return originalResult;
              };
            })();
          }
          angular.forEach(button.menuItems, setScopeRec);
        };

        /**
         * Update the chart by destroying and recreating it.
         * Some default values will be used, then the options values
         */
        var updateChart = function () {
          if (!scope.options) {
            return;
          }

          // Init the options with some defaults
          var options = {
            chart: {
              renderTo: element[0],
              events: { redraw: redrawCallback },
              height: attrs.height || null,
              width: attrs.width || null
            }
          };

          // Extend the options with the provided default, if any
          var defaultOptions = $chartDefaults(scope.default);
          options = Highcharts.merge(options, defaultOptions);

          // Get the actual options implementation
          var userOptions = scope.options;
          options = Highcharts.merge(options, userOptions);

          // Apply the scope changes after every function
          setScopeApplyToFns(options);

          // Destroy the chart so we don't leak memory
          if (chart) {
            chart.destroy();
          }
          // Create the new chart
          chart = new Highcharts.Chart(options);

          // Consolidate series toggling
          showHideSeries();
        };

        // Update when the default changes
        scope.$watch('default', updateChart, true);

        // Update when charts data changes
        scope.$watch('options', updateChart, true);

        // Hide or show some series when they change
        scope.$watch('hiddenSeries', function () {
          if (!chart) {
            return;
          }
          showHideSeries();
        });

        // On scope destruction, clean the chart
        scope.$on('$destroy', function () {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };

  }
);