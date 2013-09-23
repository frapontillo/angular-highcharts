angular.module('frapontillo.highcharts', ['frapontillo.highcharts.directives']);
'use strict';
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
        var redrawCallback = function (event) {
          var series = event.currentTarget.series;
          var hiddenItems = [];
          for (var s in series) {
            if (!series[s].visible) {
              hiddenItems.push(s);
            }
          }
          if (!angular.equals(scope.hiddenSeries, hiddenItems)) {
            angular.copy(hiddenItems, scope.hiddenSeries);
            scope.$apply();
          }
        };
        var showHideSeries = function () {
          if (!scope.chart || !scope.hiddenSeries)
            return;
          for (var s in scope.chart.series) {
            var show = !$filter('filter')(scope.hiddenSeries, s).length;
            scope.chart.series[s].setVisible(show, false);
          }
          scope.chart.redraw();
        };
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
          var chartsDefaults = {
              chart: {
                renderTo: element[0],
                events: { redraw: redrawCallback },
                type: scope.type || null,
                height: attrs.height || null,
                width: attrs.width || null
              }
            };
          var settings = {};
          jQuery.extend(true, settings, chartsDefaults);
          jQuery.extend(true, settings, scope.value);
          setScopeApplyToFns(settings);
          if (scope.chart)
            scope.chart.destroy();
          scope.chart = new Highcharts.Chart(settings);
          showHideSeries();
        };
        scope.$watch('value', updateChart);
        scope.$watch('type', updateChart);
        scope.$watch('hiddenSeries', function (newValue, oldValue) {
          if (!scope.chart)
            return;
          showHideSeries();
        });
      }
    };
  }
]);