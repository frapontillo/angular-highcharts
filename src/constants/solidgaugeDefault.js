'use strict';

angular.module('frapontillo.highcharts.constants')

  /**
   * @ngdoc object
   * @name frapontillo.highcharts.constants.constant:SOLIDGAUGE_DEFAULT
   *
   * @description
   * Default configuration for a solid gauge type of chart.
   *
   * @return {object} SOLIDGAUGE_DEFAULT Sparkline configuration defaults.
   */
  .constant('SOLIDGAUGE_DEFAULT', {
    name: 'solidgauge',
    options: {
      chart: {
        type: 'solidgauge'
      },
      title: null,
      credits: {
        enabled: false
      },
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickPixelInterval: 400,
        tickWidth: 0,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -30,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    }
  });

angular.module('frapontillo.highcharts.constants')
  .config(function ($chartDefaultsProvider, SOLIDGAUGE_DEFAULT) {
    $chartDefaultsProvider.addDefault(SOLIDGAUGE_DEFAULT.name, SOLIDGAUGE_DEFAULT.options);
  });