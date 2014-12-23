export
default class Resize {
  constructor(Mouse) {
    this.Mouse = Mouse;
  }

  start(shape) {
    this.currentShape = shape;
    this.oldShape = angular.copy(shape);
  }

  mouseMove() {
    this.currentShape.width = this.oldShape.width + this.Mouse.state.deltaX;
    this.currentShape.height = this.oldShape.height + this.Mouse.state.deltaY;
  }

  finish() {
    this.currentShape = null;
    this.oldShape = null;
  }
}