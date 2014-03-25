/**
 * angular-highcharts-chart-directive
 * @version v0.1.0 - 2014-03-25
 * @author Francesco Pontillo <francescopontillo@gmail.com>
 * @link https://github.com/frapontillo/angular-highcharts
 * @license Apache License 2.0
 */
angular.module('frapontillo.highcharts', ['frapontillo.highcharts.directives']);
/* jshint globalstrict:true */
/* global jQuery:false */
/* global Highcharts:false */
angular.module('frapontillo.highcharts.directives', []).directive('chart', [
  '$filter',
  function ($filter) {
    return {
      restrict: 'E',
      template: '<div></div>',
      transclude: true,
      replace: true,
      scope: {
        value: '=',
        hiddenSeries: '=',
        type: '='
      },
      link: function (scope, element, attrs) {
        scope.chart = null;
        // When the chart is redrawn we want to consolidate the visible items
        // with the object scope.hiddenSeries
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
            angular.copy(hiddenItems, scope.hiddenSeries);
            // Since the event is called outside of AngularJS, we have to apply the changes
            scope.$apply();
          }
        };
        // Consolidate the series visibility
        var showHideSeries = function () {
          if (!scope.chart || !scope.hiddenSeries)
            return;
          // Loop through the chart series
          for (var s in scope.chart.series) {
            // Show or hide the series in scope.hiddenSeries
            var show = !$filter('filter')(scope.hiddenSeries, s).length;
            scope.chart.series[s].setVisible(show, false);
          }
          scope.chart.redraw();
        };
        // All of the functions are triggered by Highcharts, so they
        // are executed outside of AngularJS.
        // Every function defined by the user must be followed by scope.$apply().
        var setScopeApplyToFns = function (chartValues) {
          if (!chartValues || !chartValues.exporting)
            return;
          for (var x in chartValues.exporting.buttons) {
            setScopeRec(chartValues.exporting.buttons[x]);
          }
        };
        var setScopeRec = function (button) {
          if (button.onclick) {
            button.onclick = function () {
              var _a = button.onclick;
              return function () {
                var originalResult = _a.apply(this, arguments);
                scope.$apply();
                return originalResult;
              };
            }();
          }
          if (button.menuItems && button.menuItems.length > 0) {
            angular.forEach(button.menuItems, function (value) {
              setScopeRec(value);
            });
          }
        };
        var updateChart = function () {
          if (!scope.value)
            return;
          // Chart default values
          var chartsDefaults = {
              chart: {
                renderTo: element[0],
                events: { redraw: redrawCallback },
                type: scope.type || null,
                height: attrs.height || null,
                width: attrs.width || null
              }
            };
          // Copy the chart object so we don't override it
          var settings = {};
          jQuery.extend(true, settings, chartsDefaults);
          jQuery.extend(true, settings, scope.value);
          // Apply the scope changes after every function
          setScopeApplyToFns(settings);
          // Destroy the chart so we don't leak memory
          if (scope.chart)
            scope.chart.destroy();
          // Create the new chart
          scope.chart = new Highcharts.Chart(settings);
          // Consolidate series
          showHideSeries();
        };
        // Update when charts data changes
        scope.$watch('value', updateChart);
        // Update when chart type changes
        scope.$watch('type', updateChart);
        // Hide or show some series when they change
        scope.$watch('hiddenSeries', function (newValue, oldValue) {
          if (!scope.chart)
            return;
          showHideSeries();
        });
      }
    };
  }
]);