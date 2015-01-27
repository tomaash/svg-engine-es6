'use strict';

angular.module('b4Editor').factory('LineTool', function(Mouse, Move) {
    var LINE_TEMPLATE = {
      shapeId: 0, shapeType: 'line',
      x1: 0, y1: 0, x2: 0, y2: 0,
      stroke: 'black', 'stroke-width': 1
    };

    var newObj = function(id) {
      var newObj = angular.copy(LINE_TEMPLATE);
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
      //var x = (this.obj.x1 < this.obj.x2) ? this.obj.x1 : this.obj.x2;
      //var y = (this.obj.y1 < this.obj.y2) ? this.obj.y1 : this.obj.y2;
      var x = this.obj.x1;
      var y = this.obj.y1;
      var w = this.obj.x2 - this.obj.x1;
      var h = this.obj.y2 - this.obj.y1;
      if (w < 0) w = -w;
      if (h < 0) h = -h;
      return { x: x, y: y, width: w, height: h };
    }

    var setFrameXY = function(x, y) {
      //  check rotation here 
      var dx = this.obj.x2 - this.obj.x1;
      var dy = this.obj.y2 - this.obj.y1;
      this.obj.x1 = x;
      this.obj.y1 = y;
      this.obj.x2 = x + dx;
      this.obj.y2 = y + dy;
    }

    var activate = function(obj) {
      this.obj = obj;
    };

    var deactivate = function() {
      this.obj = null;
    };

    var mouseDown = function(e) {
      this.obj.x1 = Mouse.state.startX;
      this.obj.y1 = Mouse.state.startY;
      this.obj.x2 = Mouse.state.startX;
      this.obj.y2 = Mouse.state.startY;
    };

    var mouseUp = function(e) {
    };

    var mouseMove = function(e) {
      this.obj.x2 = Mouse.state.currentX;
      this.obj.y2 = Mouse.state.currentY;
    };

    var click = function(e) {
      return true;
    };

    return {
        newObj: newObj,
        setObj: activate,
        getFrame: getFrame,
        setFrameXY: setFrameXY,
        clone: clone,
        setMode: setMode,
        activate: activate,
        deactivate: deactivate,
        finish: deactivate,
        mouseDown: mouseDown,
        mouseUp: mouseUp,
        mouseMove: mouseMove,
        click: click
		};
	});
