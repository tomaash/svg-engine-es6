'use strict';

angular.module('svgTextEditor')
  .factory('Move', function(Mouse) {
    var currentShape, oldShape;
    var start = function (shape) {
      currentShape = shape;
      oldShape = angular.copy(shape);
    };

    var mouseMove = function () {
      currentShape.x = oldShape.x + Mouse.state.deltaX;
      currentShape.y = oldShape.y + Mouse.state.deltaY;
    };

    var finish = function () {
      currentShape = null;
      oldShape = null;
    };

    return {
      start: start,
      mouseMove: mouseMove,
      finish: finish
    };
  });