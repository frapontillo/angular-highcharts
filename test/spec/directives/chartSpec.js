/* jshint globalstrict:true */
'use strict';

describe('Directive: chart', function () {
  beforeEach(module('angular.highcharts'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<chart></chart>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the chart directive');
  }));
});
