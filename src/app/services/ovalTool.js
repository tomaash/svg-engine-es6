'use strict';

angular.module('b4Editor').factory('OvalTool', function(Mouse, Move) {
    var OVAL_TEMPLATE = {
      shapeId: 0, shapeType: 'oval',
      cx: 0, cy: 0, rx: 0, ry: 0,
      fill: 'white', 'fill-opacity': "0",
      stroke: 'black', 'stroke-width': 1
    };

    var newObj = function(id) {
      var newObj = angular.copy(OVAL_TEMPLATE);
      newObj.shapeId = id;
      return newObj;
    };

    var clone = function(obj) {
      return angular.copy(obj);
    };

    var setMode = function(mode) {
      this.mode = mode;
    }

    var getFrame = function() {
      //  check rotation here 
      return { x: this.obj.cx - this.obj.rx, y: this.obj.cy - this.obj.ry, 
               width: 2 * this.obj.rx, height: 2 * this.obj.ry };
    }
    var setFrameXY = function(x, y) {
      //  check rotation here 
      this.obj.cx = x + this.obj.rx;
      this.obj.cy = y + this.obj.ry;
    }

    var activate = function(obj) {
      this.obj = obj;
    };

    var deactivate = function() {
      this.obj = null;
    };

    var mouseDown = function(e) {
      if (this.mode == 'create') {
        this.obj.cx = Mouse.state.startX;
        this.obj.cy = Mouse.state.startY;
      }
    };

    var mouseUp = function(e) {
    };

    var mouseMove = function(e) {
      if (this.mode == 'create') {
        this.obj.rx = (Mouse.state.deltaX > 0) ? Mouse.state.deltaX : -Mouse.state.deltaX;
        this.obj.ry = (Mouse.state.deltaY > 0) ? Mouse.state.deltaY : -Mouse.state.deltaY;
      } else {
      }
    };

    var click = function(e) {
      return true;
    };

    return {
        newObj: newObj,
        setObj: activate,
        clone: clone,
        setMode: setMode,
        getFrame: getFrame,
        setFrameXY: setFrameXY,
        activate: activate,
        deactivate: deactivate,
        finish: deactivate,
        mouseDown: mouseDown,
        mouseUp: mouseUp,
        mouseMove: mouseMove,
        click: click
		};
	});
