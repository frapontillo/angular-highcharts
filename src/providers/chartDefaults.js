'use strict';

angular.module('frapontillo.highcharts.providers')

  /**
   * @ngdoc object
   * @name frapontillo.highcharts.providers.$chartDefaultsProvider
   *
   * @description
   * `$chartDefaultsProvider` can be used during the config phase of your app to add new chart defaults options.
   * Those options can later be used by the {@link frapontillo.highcharts.directives.directive:chart} directive to
   * retrieve the desired default.
   */
  .provider('$chartDefaults', function () {
    var chartDefaults = {};

    /**
     * @ngdoc function
     * @name frapontillo.highcharts.providers.$chartDefaultsProvider#addDefault
     * @methodOf frapontillo.highcharts.providers.$chartDefaultsProvider
     *
     * @description
     * Add some default to the chart defaults.
     *
     * @param {string} name - The name of the default.
     * @param {object} options - The default object.
     *
     * @throws {Error} If the name or the options are not defined.
     */
    this.addDefault = function (name, options) {
      if (!name) {
        throw new Error('You have to specify a name for the defaults.');
      }
      if (!options) {
        throw new Error('You have to specify some options for the defaults.');
      }
      if (chartDefaults[name]) {
        throw new Error('The default ' + name + ' is already defined.');
      }
      chartDefaults[name] = options;
    };

    /**
     * @ngdoc service
     * @kind function
     * @name frapontillo.highcharts.providers.$chartDefaults
     *
     * @description
     * Service to retrieve every chart default configuration.
     * The `$chartDefaults` service is later used by the {@link frapontillo.highcharts.directives.directive:chart}
     * directive to retrieve the desired default.
     *
     * @returns {function} A getter function that accepts a default name and returns the default object.
     */
    this.$get = function () {
      // always return the array of chart defaults
      return function(name) {
        return chartDefaults[name];
      };
    };
  });
