'use strict';

angular.module('svgTextEditor')
  .controller('SpreadCtrl', function($scope, Mouse, Move, Resize) {

    $scope.Mouse = Mouse;

    var TOOLS = {
      'resize': Resize
    };

    var RECT_TEMPLATE = {
      shapeId: 0, shapeType: 'rect',
      x: 120, y: 120, width: 50, height: 50,
      fill: 'white', 'fill-opacity': "0",
      stroke: 'black', 'stroke-width': 1,
      resizeTool: { x: 110, y: 110, width: 10, height: 10, stroke: 'black', 'stroke-width': 2 },
      rotateTool: { cx: 60, cy: 130, rx: 10, ry: 10, stroke: 'black', 'stroke-width': 2 },
      toolState: { on: false, visibility: 'hidden', mode: false }
    };

    $scope.shapes = {
      1: {
        shapeId: 1,
        shapeType: 'line',
        x1: 50,
        y1: 50,
        x2: 80,
        y2: 80,
        stroke: 'brown',
        'stroke-width': 2
      },
      2: {
        shapeId: 2,
        shapeType: 'rect',
        x: 100,
        y: 10,
        width: 100,
        height: 100,
        fill: 'lightgreen',
        stroke: 'brown',
        'stroke-width': 10,
        resizeTool: {
        x: 110,
        y: 110,
        width: 10,
        height: 10,
        stroke: 'black',
        'stroke-width': 2
        },
        rotateTool: {
          cx: 60,
          cy: 130,
          width: 10,
          height: 10,
          stroke: 'black',
          'stroke-width': 2
        },
        toolState: {
          on: false,
          visibility: 'hidden',
          mode: false
        }
      },
    };

    $scope.contexts = {
      1: {},
      2: {}
    };

    $scope.toolGroup = { 
      on: false,
      visibility: 'hidden',
      mode: false,
      cx: 0,
      cy: 0,
      width: 10,
      height: 10,
      stroke: 'black',
      'stroke-width': 2,
      service: null
     };

    var getContext = function() {
      return $scope.contexts[$scope.currentShape.shapeId];
    };

    var getTool = function() {
      console.log('---->getTool');
      console.log($scope.currentShape);
      return ($scope.currentShape) ? 
      $scope.currentShape.toolState.service : null;
    };

    var setTool = function(tool) {
      $scope.currentShape.toolState.service = tool;
    };

    var randomInt = function(radix) {
      return Math.round(Math.random() * (radix || 1000000));
    };

    $scope.addRect = function() {
      var newId = randomInt();
      var newRect = angular.copy(RECT_TEMPLATE);
      newRect.shapeId = newId;
      newRect.x = 2 * randomInt(100);
      newRect.y = 2 * randomInt(100);
      $scope.shapes[newId] = newRect;
    };

    $scope.selectShape = function(e) {
      if (e.target.dataset.id) {
        $scope.currentShape = $scope.shapes[e.target.dataset.id] || $scope.shapes[e.target.dataset.parent];
      }
    };

    $scope.mouseDown = function(e) {
      Mouse.mouseDown(e);
      console.log(e);
      if ($scope.currentShape && $scope.currentShape.shapeId &&
        (e.target.dataset.id !== $scope.currentShape.shapeId) &&
        (e.target.dataset.parent !== $scope.currentShape.shapeId)
      ) {
        getContext().hideTools();
      }
      $scope.selectShape(e);

      if (e.target.dataset.type === 'tool') {
        setTool(TOOLS[e.target.dataset.mode]);
        $scope.toolGroup.id = e.target.dataset.id;
        $scope.toolGroup.mode = e.target.dataset.mode;
      } else if (e.target.dataset.type) {
        setTool(Move);
      } else {
        return;
      }
      getTool().start($scope.currentShape, $scope.toolGroup);
    };

    $scope.mouseUp = function(e) {
      if (Mouse.state.moving) {
        getContext().hideTools();
        getTool().finish();
      }
      Mouse.mouseUp(e);
    };

    $scope.mouseMove = function(e) {
      Mouse.mouseMove(e);
      if (Mouse.state.down) {
        if (getTool()) {
          getTool().mouseMove();
          getContext().updateToolPositions();
        }
      }
    };

    $scope.mouseClick = function(e) {
      if (Mouse.click(e)) {
        $scope.selectShape(e);
        if (!e.target.dataset.type) {
          getContext().hideTools();
        }
        if (e.target.dataset.type === 'object') {
          if ($scope.currentShape.toolState.on) {
            getContext().hideTools();
          } else {
            getContext().showTools($scope.toolGroup);
          }
        }
      }
    };
  });
