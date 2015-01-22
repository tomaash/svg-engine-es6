'use strict';

angular.module('b4Editor').factory('Rubberband', function(Mouse) {
    var start = function(tool) {
      this.tool = tool;
      this.tool.x = Mouse.state.startX;
      this.tool.y = Mouse.state.startY;
      this.tool.width = 0;
      this.tool.height = 0;
      this.tool.visibility = 'visible';
    };
    
    var mouseMove = function () {
      if (Mouse.state.deltaX > 0) {
        this.tool.width = Mouse.state.deltaX;
      } else {
        this.tool.x = Mouse.state.startX + Mouse.state.deltaX;
        this.tool.width = -Mouse.state.deltaX;
      }
      if (Mouse.state.deltaY > 0) {
        this.tool.height = Mouse.state.deltaY;
      } else {
        this.tool.y = Mouse.state.startY + Mouse.state.deltaY;
        this.tool.height = -Mouse.state.deltaY;
      }
    };

    var finish = function () {
      this.tool.visibility = 'hidden';
    };
    
    return { start: start, mouseMove: mouseMove, finish: finish };
  });
