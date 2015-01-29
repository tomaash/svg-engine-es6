export
default class Resize {
  constructor(Mouse) {
    this.Mouse = Mouse;
  }

  start(shape) {
    this.currentShape = shape;
    this.oldShape = angular.copy(shape);
    this.vector = null;
  }

  mouseMove() {
    var deltaX = this.Mouse.state.deltaX;
    var deltaY = this.Mouse.state.deltaY;
    var finalDeltaX = deltaX;
    var finalDeltaY = deltaY;
    var angle = this.currentShape.angle;
    if (this.currentShape.angle !== 0) {
      this.vector = new Victor(deltaX, deltaY);
      this.vector.rotateDeg(-angle);
      finalDeltaX = this.vector.x;
      finalDeltaY = this.vector.y;
    }
    this.currentShape.width = this.oldShape.width + finalDeltaX;
    this.currentShape.height = this.oldShape.height + finalDeltaY;
  }

  finish() {
    this.currentShape = null;
    this.oldShape = null;
  }
}