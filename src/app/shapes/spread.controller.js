'use strict';

angular.module('b4Editor')
.controller('SpreadCtrl', function($scope, Mouse, Move, Resize, Rubberband) {

    $scope.Mouse = Mouse;
    $scope.tool = null;

    var nextID = 3;
    var TOOLS = { 'resize': Resize };

    var LINE_TEMPLATE = {
      shapeId: 0, shapeType: 'line',
      x1: 0, y1: 0, x2: 0, y2: 0,
      stroke: 'black', 'stroke-width': 1
    };

    var OVAL_TEMPLATE = {
      shapeId: 0, shapeType: 'oval',
      cx: 0, cy: 0, rx: 0, ry: 0,
      fill: 'white', 'fill-opacity': "0",
      stroke: 'black', 'stroke-width': 1
    };

    var RECT_TEMPLATE = {
      shapeId: 0, shapeType: 'rect',
      x: 0, y: 0, width: 50, height: 50,
      fill: 'white', 'fill-opacity': "0",
      stroke: 'black', 'stroke-width': 1
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

    $scope.toolRRGroup = { id: '', on: false, visibility: 'hidden', mode: false, isLine: false,
                         cx: 0, cy: 0, width: 10, height: 10, stroke: 'black', 'stroke-width': 2 };

    $scope.toolRB = { id: '', on: false, visibility: 'hidden', mode: false,
                      x: 0, y: 0, width: 0, height: 0, stroke: 'black', 'stroke-width': 2 };

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

    $scope.addCircle = function() {
      var newObj = angular.copy(OVAL_TEMPLATE);
      var id = nextID++;
      newObj.shapeId = id;
      newObj.cx = 2 * randomInt(100);
      newObj.cy = randomInt(100);
      newObj.rx = randomInt(100);
      newObj.ry = newObj.rx;
      $scope.shapes[id] = newObj;      
    };

    $scope.addOval = function() {
      var newObj = angular.copy(OVAL_TEMPLATE);
      var id = nextID++;
      newObj.shapeId = id;
      newObj.cx = 2 * randomInt(100);
      newObj.cy = 2 * randomInt(100);
      newObj.rx = randomInt(100);
      newObj.ry = randomInt(100);
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
        $scope.toolRRGroup.id = e.target.dataset.id;
        $scope.toolRRGroup.mode = e.target.dataset.mode;
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
        getTool().start($scope.currentShape, $scope.toolRRGroup);
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
          if ($scope.toolRRGroup.on) {
            getContext().hideTools();
          } else {
            getContext().showTools($scope.toolRRGroup);
          }
        }
      }
    }
  });
