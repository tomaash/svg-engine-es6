'use strict';

angular.module('b4Editor')
  .factory('Resize', function(Mouse) {
    var currentShape, oldShape;
    var toolGroup;

    var start = function(shape, tg) {
      currentShape = shape;
      toolGroup = tg;
      oldShape = angular.copy(shape);
    };

    var mouseMove = function () {
      var mouseDelta = { x: Mouse.state.deltaX, y: Mouse.state.deltaY };
      if (oldShape.shapeType === 'line') {
        if (toolGroup.id === 'tl') {
          currentShape.x1 = oldShape.x1 + mouseDelta.x;
          currentShape.y1 = oldShape.y1 + mouseDelta.y;
        } else if (toolGroup.id === 'br') {
          currentShape.x2 = oldShape.x2 + mouseDelta.x;
          currentShape.y2 = oldShape.y2 + mouseDelta.y;
        } else {
          var cx = (currentShape.x1 + currentShape.x2)/2, cy = (currentShape.y1 + currentShape.y2)/2;
          var dx = mouseDelta.x - cx;
          var dy = mouseDelta.y - cy;
          var a = Math.atan2(dy, dx) * 180 / Math.PI;// + 180;
          var ac = Math.cos(a), as = Math.sin(a);
          dx = oldShape.x1 - cx;
          dy = oldShape.y1 - cy;
          currentShape.x1 = dx * ac + dy * as + cx;
          currentShape.y1 = -dx * as + dy * ac + cy;
          dx = oldShape.x2 - cx;
          dy = oldShape.y2 - cy;
          currentShape.x2 = dx * ac + dy * as + cx;
          currentShape.y2 = -dx * as + dy * ac + cy;
        }
      } else if (oldShape.shapeType === 'oval') {
        if (toolGroup.id === 'tl') {
          currentShape.rx = oldShape.rx - mouseDelta.x;
          currentShape.ry = oldShape.ry - mouseDelta.y;
        } else if (toolGroup.id === 'tm') {
          currentShape.ry = oldShape.ry - mouseDelta.y;
        } else if (toolGroup.id === 'tr') {
          currentShape.rx = oldShape.rx + mouseDelta.x;
          currentShape.ry = oldShape.ry - mouseDelta.y;
        } else if (toolGroup.id === 'lm') {
          currentShape.rx = oldShape.rx - mouseDelta.x;
        } else if (toolGroup.id === 'rm') {
          currentShape.rx = oldShape.rx + mouseDelta.x;
        } else if (toolGroup.id === 'bl') {
          currentShape.rx = oldShape.rx - mouseDelta.x;
          currentShape.ry = oldShape.ry + mouseDelta.y;
        } else if (toolGroup.id === 'bm') {
          currentShape.ry = oldShape.ry + mouseDelta.y;
        } else if (toolGroup.id === 'br') {
          currentShape.rx = oldShape.rx + mouseDelta.x;
          currentShape.ry = oldShape.ry + mouseDelta.y;
        } else {
        }

        if (currentShape.rx < 0) {
          currentShape.cx = oldShape.cx + currentShape.rx;
          currentShape.rx = -currentShape.rx;
        }
        if (currentShape.ry < 0) {
          currentShape.cy = oldShape.cy + currentShape.ry;
          currentShape.ry = -currentShape.ry;
        }
      } else {
        var x = oldShape.x, y = oldShape.y;
        var w = oldShape.width, h = oldShape.height;
        
        if (toolGroup.id === 'tl') {
          currentShape.x = x + mouseDelta.x;
          currentShape.y = y + mouseDelta.y;
          currentShape.width = w - mouseDelta.x;
          currentShape.height = h - mouseDelta.y;
        } else if (toolGroup.id === 'tm') {
          currentShape.y = y + mouseDelta.y;
          currentShape.height = h - mouseDelta.y;
        } else if (toolGroup.id === 'tr') {
          currentShape.y = y + mouseDelta.y;
          currentShape.width = w + mouseDelta.x;
          currentShape.height = h - mouseDelta.y;
        } else if (toolGroup.id === 'lm') {
          currentShape.x = x + mouseDelta.x;
          currentShape.width = w - mouseDelta.x;
        } else if (toolGroup.id === 'rm') {
          currentShape.width = w + mouseDelta.x;
        } else if (toolGroup.id === 'bl') {
          currentShape.x = x + mouseDelta.x;
          currentShape.width = w - mouseDelta.x;
          currentShape.height = h + mouseDelta.y;
        } else if (toolGroup.id === 'bm') {
          currentShape.height = h + mouseDelta.y;
        } else if (toolGroup.id === 'br') {
          currentShape.width = w + mouseDelta.x;
          currentShape.height = h + mouseDelta.y;
        } else {
          var cx = x + w/2, cy = y + h/2;
          var dx = mouseDelta.x;// - cx;
          var dy = mouseDelta.y;// - cy;
          var a = Math.atan2(dy, dx) * 180 / Math.PI;// + 180;
          currentShape.transform = 'rotate(' + a + ' ' + cx + ' ' + cy + ')';
          console.log('delta x, y ' + dx + ', ' + dy + ' center x, y ' + cx + ', ' + cy + ' angle ' + a);
          toolGroup.transform = currentShape.transform;
        }

        if (currentShape.width < 0) {
          currentShape.x = oldShape.x + currentShape.width;
          currentShape.width = -currentShape.width;
        }
        if (currentShape.height < 0) {
          currentShape.y = oldShape.y + currentShape.height;
          currentShape.height = -currentShape.height;
        }
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
