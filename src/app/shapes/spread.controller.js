'use strict';

angular.module('b4Editor')
  .controller('SpreadCtrl', function($scope, Mouse, Move, Resize) {

    $scope.Mouse = Mouse;
    $scope.tool = null;

    var nextID = 3;
    var TOOLS = { 'resize': Resize };

    var LINE_TEMPLATE = {
      shapeId: 0, shapeType: 'line',
      x1: 80, y1: 320, x2: 20, y2: 20,
      stroke: 'black', 'stroke-width': 1
    };
    var OVAL_TEMPLATE = {
      shapeId: 0, shapeType: 'oval',
      cx: 80, cy: 320, rx: 20, ry: 20,
      fill: 'white', 'fill-opacity': "0",
      stroke: 'black', 'stroke-width': 1
    };

    var RECT_TEMPLATE = {
      shapeId: 0, shapeType: 'rect',
      x: 120, y: 120, width: 50, height: 50,
      fill: 'white', 'fill-opacity': "0",
      stroke: 'black', 'stroke-width': 1,
      //resizeTool: { x: 110, y: 110, width: 10, height: 10, stroke: 'black', 'stroke-width': 2 },
      //rotateTool: { cx: 60, cy: 130, rx: 10, ry: 10, stroke: 'black', 'stroke-width': 2 },
      //toolState: { on: false, visibility: 'hidden', mode: false }
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
        'stroke-width': 10
      },
    };

    $scope.contexts = {
      1: {},
      2: {}
    };

    $scope.toolGroup = { id: '', on: false, visibility: 'hidden', mode: false,
                         cx: 0, cy: 0, width: 10, height: 10, stroke: 'black', 'stroke-width': 2 };

    var getContext = function() {
      return $scope.contexts[$scope.currentShape.shapeId];
    };

    var getTool = function() {
      return $scope.currentTool;
    };

    var setTool = function(tool) {
      $scope.currentTool = tool;
    };

    var randomInt = function(radix) {
      return Math.round(Math.random() * (radix || 1000000));
    };

    $scope.addLine = function() {
      var newObj = angular.copy(LINE_TEMPLATE);
      var id = nextID++;
      newObj.shapeId = id;
      newObj.x1 = 2 * randomInt(100);
      newObj.y1 = 2 * randomInt(100);
      newObj.x2 = 2 * randomInt(100);
      newObj.y2 = 2 * randomInt(100);
      console.log(newObj);
      $scope.shapes[id] = newObj;
    };

    $scope.addOval = function() {
      var newObj = angular.copy(OVAL_TEMPLATE);
      var id = nextID++;
      newObj.shapeId = id;
      newObj.cx = 2 * randomInt(100);
      newObj.cy = 2 * randomInt(100);
      $scope.shapes[id] = newObj;      
    };

    $scope.addRect = function() {
      var newRect = angular.copy(RECT_TEMPLATE);
      var id = nextID++;
      newRect.shapeId = id;
      newRect.x = 2 * randomInt(100);
      newRect.y = 2 * randomInt(100);
      $scope.shapes[id] = newRect;
    };

    $scope.selectShape = function(e) {
      if (e.target.dataset.id) {
        $scope.currentShape = $scope.shapes[e.target.dataset.id] || $scope.shapes[e.target.dataset.parent];
      }
    };

    $scope.mouseDown = function(e) {
      Mouse.mouseDown(e);

      if ($scope.currentShape && e.target.dataset.type === 'tool') {
        setTool(Resize);
        $scope.toolGroup.id = e.target.dataset.id;
        $scope.toolGroup.mode = e.target.dataset.mode;
      } else {
        if ($scope.currentShape && $scope.currentShape.shapeId &&
            (e.target.dataset.id !== $scope.currentShape.shapeId)) {
          getContext().hideTools();
        }
        $scope.selectShape(e);

        if (e.target.dataset.type) {
          setTool(Move);
        } else {
          setTool(null);
        }
      }
      if (getTool())
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
          if ($scope.toolGroup.on) {
            getContext().hideTools();
          } else {
            getContext().showTools($scope.toolGroup);
          }
        }
      }
    };

  });
