/* jshint globalstrict:true */
/* global describe */
/* global beforeEach */
/* global module */
/* global it */
/* global inject */
/* global expect */
'use strict';

describe('Directive: chart', function () {
  beforeEach(module('frapontillo.highcharts'));

  var element;

  it('should should create a chart', inject(function ($rootScope, $compile) {
    element = angular.element('<chart></chart>');
    element = $compile(element)($rootScope);
    expect(element).not.toBe(undefined);
  }));
});
