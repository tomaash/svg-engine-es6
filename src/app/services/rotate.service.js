export
default class Rotate {
  constructor(Mouse) {
    this.Mouse = Mouse;
  }

  start(shape) {
    this.currentShape = shape;
    this.oldShape = angular.copy(shape);
    this.initMidpoint = new Victor(this.currentShape.width / 2, this.currentShape.height / 2);
    this.initAngle = this.initMidpoint.angleDeg();
    this.oldDelta = this._computeDelta(this.oldShape.angle);
  }

  _computeMidpoint(angle) {
    var mp = this.initMidpoint.clone();
    // Rotation of midpoint from X axis. Initial angle is w/h ration dependent
    mp.rotateByDeg(angle - (this.initAngle));
    return mp;
  }

  _computeDeltaFromMidpoint(mp) {
    return mp.subtract(this.initMidpoint);
  }

  _computeDelta(angle) {
    var mp = this._computeMidpoint(angle);
    return this._computeDeltaFromMidpoint(mp);
  }

  mouseMove() {
    // Compute new angle
    this.currentShape.angle = this.oldShape.angle - this.Mouse.state.deltaX;
    
    // Compute new midpoint
    var mp = this._computeMidpoint(this.currentShape.angle);
    this.currentShape.midX = mp.x;
    this.currentShape.midY = mp.y;
    
    // Compute delta from initial midpoint
    var delta = this._computeDeltaFromMidpoint(mp);

    // Compensate for delta and also oldDelta from initial rotation != 0 deg
    this.currentShape.x = this.oldShape.x - delta.x + this.oldDelta.x;
    this.currentShape.y = this.oldShape.y - delta.y + this.oldDelta.y;
  }

  finish() {
    this.currentShape = null;
    this.oldShape = null;
  }
}