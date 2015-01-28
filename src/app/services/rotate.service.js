export
default class Rotate {
  constructor(Mouse) {
    this.Mouse = Mouse;
  }

  start(shape) {
    this.currentShape = shape;
    this.oldShape = angular.copy(shape);
  }

  mouseMove() {
    this.currentShape.angle = this.oldShape.angle - this.Mouse.state.deltaX;
  }

  finish() {
    this.currentShape = null;
    this.oldShape = null;
  }
}