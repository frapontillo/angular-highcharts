angular-highcharts-chart-directive [![Build Status](https://travis-ci.org/frapontillo/angular-highcharts.png?branch=develop)](https://travis-ci.org/frapontillo/angular-highcharts?branch=develop)
==================================

Angular Highcharts - Easy Highcharts for your AngularJS app!

##How to use

###Install
To install the files with bower, simply call

```shell
$ bower install angular-highcharts
```

Or you can simply copy the file you want to include from the `dist` folder.

###Reference in AngularJS

Reference the module by including it into the injection array of your app:

```javascript
angular.module('myApp', ['frapontillo.highcharts']);
```

##Test and build

```shell
$ npm install grunt-cli bower karma grunt-karma -g
$ npm install
$ bower install
$ grunt test
$ grunt build
```

###Demo page

The demo page (not working yet) is a Web app scaffolded with [yeoman](http://yeoman.io/), so use `grunt server` to test the application and `grunt` to build a production ready Web app.