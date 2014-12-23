'use strict';
/*jshint esnext: true */

import MainCtrl from './main/main.controller';
import RectangleCtrl from './rectangle/rectangle.controller';

import Mouse from './services/mouse.service';
import Move from './services/move.service';
import Resize from './services/resize.service';

import RectShape from './directives/rectshape/rectshape.directive';
import ImgShape from './directives/imgshape/imgshape.directive';

import NavbarCtrl from '../components/navbar/navbar.controller';

import Router from './router';

angular.module('testAngularGulp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap', 'draganddrop'])
  .controller('MainCtrl', MainCtrl)
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('RectangleCtrl', RectangleCtrl)
  .service('Mouse', Mouse)
  .service('Move', Move)
  .service('Resize', Resize)
  .directive('imgshape', ImgShape)
  .directive('rectshape', RectShape)
  .config(Router);