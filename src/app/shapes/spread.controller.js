'use strict';

angular.module('b4Editor').controller('SpreadCtrl', function($scope, LineTool, OvalTool, RectTool, 
                                                             Mouse, Move, Resize, Rubberband) {
    $scope.Mouse = Mouse;
    $scope.tool = null;
    $scope.shapeMode = 'Drop';
    $scope.mouseMode = 'select';

    var nextID = 3;

    $scope.shapes = {
      1: {
        shapeId: 1, shapeType: 'line', x1: 250, y1: 50, x2: 380, y2: 180,
        stroke: 'brown', 'stroke-width': 2
      },
      2: {
        shapeId: 2, shapeType: 'rect', x: 100, y: 10, width: 100, height: 100,
        fill: 'lightgreen', stroke: 'brown', 'stroke-width': 10
      },
    };

    $scope.contexts = {
      1: {},
      2: {}
    };

    
    $scope.toolMap = {
    'line': LineTool,
    'oval': OvalTool,
    'rect': RectTool
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
      if ($scope.shapeMode === 'Drop') {
        var id = nextID++;
        var newObj = LineTool.newObj(id);
        newObj.x1 = 2 * randomInt(100);
        newObj.y1 = 2 * randomInt(100);
        newObj.x2 = 2 * randomInt(100);
        newObj.y2 = 2 * randomInt(100);
        $scope.shapes[id] = newObj;
      } else {
        setTool(LineTool);
      }
    };

    $scope.addOval = function() {
      if ($scope.shapeMode === 'Drop') {      
        var id = nextID++;
        var newObj = OvalTool.newObj(id);
        newObj.cx = 2 * randomInt(100);
        newObj.cy = 2 * randomInt(100);
        newObj.rx = randomInt(100);
        newObj.ry = randomInt(100);
        $scope.shapes[id] = newObj;      
      } else {
        setTool(OvalTool);
      }
    };

    $scope.addRect = function() {
      if ($scope.shapeMode === 'Drop') {      
        var id = nextID++;
        var newObj = RectTool.newObj(id);
        newObj.shapeId = id;
        newObj.x = 2 * randomInt(100);
        newObj.y = 2 * randomInt(100);
        newObj.width = 50;
        newObj.height = 50;
        $scope.shapes[id] = newObj;
      } else { 
        setTool(RectTool);
      }
    };

    $scope.changeShapeMode = function() {
      $scope.shapeMode = ($scope.shapeMode === 'Drop') ? 'Create' : 'Drop';
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
        Resize.start($scope.currentShape, $scope.toolRRGroup);
      } else {
        var tool = getTool();
        if (tool) {
          
          var id = nextID++;
          var newObj = tool.newObj(id);
          $scope.shapes[id] = newObj;
          tool.setMode('create');
          tool.activate(newObj);
          tool.mouseDown(e);
        } else {
          if ($scope.currentShape && $scope.currentShape.shapeId &&
              (e.target.dataset.id !== $scope.currentShape.shapeId)) {
            getContext().hideTools();
          }
          $scope.selectShape(e);
          
          if (e.target.dataset.type) {
            $scope.mouseMode = 'move';
            //setTool(Move);
            //Move.start($scope.currentShape);
          } else {
            setTool(Rubberband);
            Rubberband.start($scope.toolRB);
          }
        }
      }
    };

    $scope.mouseUp = function(e) {
      if (Mouse.state.moving) {
        var tool = getTool();
        if (tool) tool.finish();
        if ($scope.toolRRGroup.on) getContext().hideTools();
        setTool(null);
        $scope.mouseMode = 'select';
      }
      Mouse.mouseUp(e);
      
    };

    $scope.mouseMove = function(e) {
      Mouse.mouseMove(e);
      if (Mouse.state.down) {
        if (getTool()) {
          getTool().mouseMove();
          //getContext().updateToolPositions();
        } else if ($scope.mouseMode === 'move') {
          var tool = $scope.toolMap[$scope.currentShape.shapeType];
          tool.setObj($scope.currentShape);
          var dx = Mouse.state.currentX - Mouse.state.lastX;
          var dy = Mouse.state.currentY - Mouse.state.lastY;

          var frame = tool.getFrame();
          tool.setFrameXY(frame.x + dx, frame.y + dy);
        }
        Mouse.state.lastX = Mouse.state.currentX;
        Mouse.state.lastY = Mouse.state.currentY;
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
    };
  });
