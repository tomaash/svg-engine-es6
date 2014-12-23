export
default class Router {
  constructor($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl as vm'
      })
      .state('rectangle', {
        url: '/rectangle',
        templateUrl: 'app/rectangle/rectangle.html',
        controller: 'RectangleCtrl as vm'
      });
    $urlRouterProvider.otherwise('/');
  }
}