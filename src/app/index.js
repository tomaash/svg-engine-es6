'use strict';
rangy.init();

angular.module('b4Editor', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('shapes', {
        url: '/shapes',
        templateUrl: 'app/shapes/spread.html',
        controller: 'SpreadCtrl'
      });
    $urlRouterProvider.otherwise('/');
  })
;
