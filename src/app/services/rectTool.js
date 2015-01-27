'use strict';

angular.module('b4Editor').factory('RectTool', function(Mouse, Move) {
    var mode = 'none';

    var RECT_TEMPLATE = {
      shapeId: 0, shapeType: 'rect', x: 0, y: 0, width: 0, height: 0,
      fill: 'white', 'fill-opacity': "0", stroke: 'black', 'stroke-width': 1
    };

    var newObj = function(id) {
      var newObj = angular.copy(RECT_TEMPLATE);
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
      if (this.obj.transform) {
        var parts = this.obj.transform.split('(')[1].split(')')[0].split(' ');
        var a = parts[0] - 0, ox = parts[1] - 0, oy = parts[2] - 0;
        var pt = rotatePoint(this.obj.x, this.obj.y, ox, oy, -a);
        return { x: pt.x, y: pt.y, width: this.obj.width, height: this.obj.height };
      } else 
        return { x: this.obj.x, y: this.obj.y, width: this.obj.width, height: this.obj.height };
    }

    var setFrameXY = function(x, y) {
      //  check rotation here 
      if (this.obj.transform) {
        var parts = this.obj.transform.split('(')[1].split(')')[0].split(' ');
        var a = parts[0] - 0, ox = parts[1] - 0, oy = parts[2] - 0;
        var frame = this.getFrame();

        console.log('a ' + a + ' x, y ' + ox + ', ' + oy + ' frame x, y ' + frame.x + ', ' + frame.y);
        //var pt = rotatePoint(frame.x, frame.y, ox, oy, -a);
        //console.log(pt);
        //console.log(rotatePoint(x, y, ox, oy, a));
        //pt = rotatePoint(x, y, ox, oy, -a);
        console.log('new x ' + (this.obj.x + x - frame.x) + ', y ' + (this.obj.y + y - frame.y));
        this.obj.x += x - frame.x;
        this.obj.y += y - frame.y;
      } else {
        this.obj.x = x;
        this.obj.y = y;
      }
    }

    var activate = function(obj) {
      this.obj = obj;
    };

    var deactivate = function() {
      this.obj = null;
    };

    var mouseDown = function(e) {
      if (this.mode == 'create') {
        this.obj.x = Mouse.state.startX;
        this.obj.y = Mouse.state.startY;
      }
    };

    var mouseUp = function(e) {
    };

    var mouseMove = function(e) {
      if (this.mode == 'create') {
        if (Mouse.state.deltaX > 0) {
          this.obj.width = Mouse.state.deltaX;
        } else {
          this.obj.x = Mouse.state.startX + Mouse.state.deltaX;
          this.obj.width = -Mouse.state.deltaX;
        }

        if (Mouse.state.deltaY > 0) {
          this.obj.height = Mouse.state.deltaY;
        } else {
           this.obj.y = Mouse.state.startY + Mouse.state.deltaY;
           this.obj.height = -Mouse.state.deltaY;
       }
      } else if (this.mode == 'move') {
        
        
      }
    };

    var click = function(e) {
      return true;
    };

    var rotatePoint = function(pointX, pointY, originX, originY, angle) {
      angle *= Math.PI / 180.0;
      var ac = Math.cos(angle), as = Math.sin(angle);
      var dx = pointX - originX, dy = pointY - originY;
      var x = ac * dx - as * dy + originX;
      var y = as * dx + ac * dy + originY;
      return { x: x, y: y };
      /*
      return {
      x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
          y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
          };
      */
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
