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
      if (oldShape.shapeType === 'oval') {
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
          var centerX = x + w/2, centerY = y + h/2;
          var deltaX = mouseDelta.x;// - centerX;
          var deltaY = mouseDelta.y;// - centerY;
          var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;// + 180;
          currentShape.transform = 'rotate(' + angle + ' ' + centerX + ' ' + centerY + ')';
          console.log('delta x, y ' + deltaX + ', ' + deltaY + 
                      ' center x, y ' + centerX + ', ' + centerY + 
                      ' angle ' + angle);
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
