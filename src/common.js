/**
 * @ngdoc overview
 * @name frapontillo.highcharts.directives
 *
 * @description
 * Module containing all of the available directives.
 * Directives need the provider to instantiate predefined defaults.
 */
angular.module('frapontillo.highcharts.directives', [ 'frapontillo.highcharts.providers' ]);

/**
 * @ngdoc overview
 * @name frapontillo.highcharts.constants
 *
 * @description
 * Module containing all of the available constants.
 * Constants need the provider to register themselves.
 */
angular.module('frapontillo.highcharts.constants', [ 'frapontillo.highcharts.providers' ]);

/**
 * @ngdoc overview
 * @name frapontillo.highcharts.providers
 *
 * @description
 * Module containing all of the available providers.
 * The provider is just an extensible array.
 */
angular.module('frapontillo.highcharts.providers', []);

/**
 * @ngdoc overview
 * @name frapontillo.highcharts
 *
 * @description
 * The main module which holds everything together: directives, providers, constants.
 */
angular.module('frapontillo.highcharts', [
  'frapontillo.highcharts.directives', 'frapontillo.highcharts.constants', 'frapontillo.highcharts.providers'
]);