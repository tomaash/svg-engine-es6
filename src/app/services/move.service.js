'use strict';

angular.module('b4Editor')
  .factory('Move', function(Mouse) {
    var currentShape, oldShape;
    var start = function (shape) {
      currentShape = shape;
      oldShape = angular.copy(shape);
    };

    var mouseMove = function () {
      if (currentShape.shapeType === 'oval') {
        currentShape.cx = oldShape.cx + Mouse.state.deltaX;
        currentShape.cy = oldShape.cy + Mouse.state.deltaY;
      } else if (currentShape.shapeType === 'line') {
        currentShape.x1 = oldShape.x1 + Mouse.state.deltaX;
        currentShape.y1 = oldShape.y1 + Mouse.state.deltaY;
        currentShape.x2 = oldShape.x2 + Mouse.state.deltaX;
        currentShape.y2 = oldShape.y2 + Mouse.state.deltaY;
      } else {
        currentShape.x = oldShape.x + Mouse.state.deltaX;
        currentShape.y = oldShape.y + Mouse.state.deltaY;
      }
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
