'use strict';
/*jshint esnext: true */

export
default class MainCtrl {
  constructor($scope, Mouse, Move, Resize, Rotate) {
    this.scope = $scope;
    this.Mouse = Mouse;
    this.Move = Move;
    this.Resize = Resize;

    this.TOOLS = {
      'resize': Resize,
      'rotate': Rotate
    };

    this.RECT_TEMPLATE = {
      shapeId: 123,
      shapeType: 'rectshape',
      x: 120,
      y: 120,
      angle: 0,
      width: 50,
      height: 50,
      fill: 'darkgreen',
      stroke: 'orange',
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
    };

    this.shapes = {
      123: {
        shapeId: 123,
        shapeType: 'rectshape',
        x: 10,
        y: 10,
        angle: 0,
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
      124: {
        shapeId: 124,
        shapeType: 'rectshape',
        x: 80,
        y: 80,
        angle: 0,
        width: 100,
        height: 100,
        fill: 'lightblue',
        stroke: 'darkblue',
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
          mode: false,
          service: null
        }
      }
    };

    this.contexts = {
      123: {},
      124: {}
    };

    this.galleryImages = [{
      source: "schoolgirl.jpg",
      thumbnail: "schoolgirl_thumb.jpg"
    }, {
      source: "chibi.jpg",
      thumbnail: "chibi_thumb.jpg"
    }, {
      source: "mugen.jpg",
      thumbnail: "mugen_thumb.jpg"
    }];
  }

  _getContext() {
    if (this.currentShape) {
      return this.contexts[this.currentShape.shapeId];
    }
  }

  _getTool() {
    return this.currentShape.toolState.service;
  }

  _setTool(tool) {
    this.currentShape.toolState.service = tool;
  }

  _randomInt(radix) {
    return Math.round(Math.random() * (radix || 1000000));
  }

  onDrop(data, event) {
    console.log(data);
    var x = event.offsetX;
    var y = event.offsetY;
    var newId = this._randomInt();
    var newRect = angular.copy(this.RECT_TEMPLATE);
    newRect.shapeId = newId;
    newRect.width = 100;
    newRect.height = 100;
    newRect.x = x - 50;
    newRect.y = y - 50;
    newRect.href = '/assets/images/' + data['json/custom-object'];
    newRect.shapeType = 'imgshape';
    this.shapes[newId] = newRect;
  }

  onDragOver(data, event) {
    // console.log(data);
    // console.log(event);
  }

  addRect() {
    var newId = this._randomInt();
    var newRect = angular.copy(this.RECT_TEMPLATE);
    newRect.shapeId = newId;
    newRect.x = 2 * this._randomInt(100);
    newRect.y = 2 * this._randomInt(100);
    this.shapes[newId] = newRect;
  }

  removeSelected() {
    delete this.shapes[this.currentShape.shapeId];
  }

  selectShape(e) {
    if (e.target.dataset.id) {
      this.currentShape = this.shapes[e.target.dataset.id] || this.shapes[e.target.dataset.parent];
    }
  }

  mouseDown(e) {
    this.Mouse.mouseDown(e);
    if (this.currentShape && this.currentShape.shapeId &&
      (e.target.dataset.id != this.currentShape.shapeId) &&
      (e.target.dataset.parent != this.currentShape.shapeId)
    ) {
      this._getContext().hideTools();
    }
    this.selectShape(e);
    if (e.target.dataset.type === 'tool') {
      var tool = this.TOOLS[e.target.dataset.mode];
      console.log(tool);
      this._setTool(tool);
    } else if (e.target.dataset.type) {
      this._setTool(this.Move);
    } else {
      return;
    }
    this._getTool().start(this.currentShape);
  }

  mouseUp(e) {
    if (this.Mouse.state.moving) {
      this._getContext().hideTools();
      this._getTool().finish();
    }
    this.Mouse.mouseUp(e);
  }

  mouseMove(e) {
    this.Mouse.mouseMove(e);
    if (this.Mouse.state.down) {
      if (this._getTool()) {
        this._getTool().mouseMove();
        this._getContext().updateToolPositions();
      }
    }
  }

  mouseClick(e) {
    if (this.Mouse.click(e)) {
      this.selectShape(e);
      if (this._getContext()) {
        if (!e.target.dataset.type) {
          this._getContext().hideTools();
        }
        if (e.target.dataset.type === 'object') {
          if (this.currentShape.toolState.on) {
            this._getContext().hideTools();
          } else {
            this._getContext().showTools();
          }
        }
      }
    }
  }
}