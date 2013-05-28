/* jshint globalstrict:true */
'use strict';

angular.module('angular.highcharts')
.directive('chart', ['$filter',
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
                    if (!scope.chart) return;
                    // Loop through the chart series
                    for (var s in scope.chart.series) {
                        // Show or hide the series in scope.hiddenSeries
                        var show = !($filter('filter')(scope.hiddenSeries, s).length);
                        scope.chart.series[s].setVisible(show, false);
                    }
                    scope.chart.redraw();
                };

                // All of the functions are triggered by Highcharts, so they
                // are executed outside of AngularJS.
                // Every function defined by the user must be followed by scope.$apply().
                var setScopeApplyToFns = function (chartValues) {
                    if (!chartValues || !chartValues.exporting) return;
					
                    for (var x in chartValues.exporting.buttons) {
                        var onClickFunction = chartValues.exporting.buttons[x].onclick;
                        if (onClickFunction) {
							// TODO: move the function definition outside of the loop
                            chartValues.exporting.buttons[x].onclick = function () {
                                onClickFunction();
                                scope.$apply();
                            };
                        }
                    }
                };

                var updateChart = function () {
                    if (!scope.value) return;
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
					angular.extend(settings, chartsDefaults);
					angular.extend(settings, scope.value);
                    // $.extend(deepCopy, settings, chartsDefaults, scope.value);
                    // Apply the scope changes after every function
                    setScopeApplyToFns(settings);
                    // Destroy the chart so we don't leak memory
                    if (scope.chart) scope.chart.destroy();
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
                    if (!scope.chart) return;
                    showHideSeries();
                });
            }
        };

    }
]);