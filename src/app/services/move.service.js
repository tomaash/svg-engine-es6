export
default class Move {
  constructor(Mouse) {
    this.Mouse = Mouse;
  }

  start(shape) {
    this.currentShape = shape;
    this.oldShape = angular.copy(shape);
  }

  mouseMove() {
    this.currentShape.x = this.oldShape.x + this.Mouse.state.deltaX;
    this.currentShape.y = this.oldShape.y + this.Mouse.state.deltaY;
  }

  finish() {
    this.currentShape = null;
    this.oldShape = null;
  }
}