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
    // this.initMidpoint.add(this.oldDelta);

    // Compensate for midpoint delta from old rotation
    this.oldShape.x += this.oldDelta.x;
    this.oldShape.y += this.oldDelta.y;

    // Compute absolute midpoint for angle calculation
    var initPosVector = new Victor(this.currentShape.x, this.currentShape.y);
    this.currentShape.initAbsMidpoint = initPosVector.add(this.initMidpoint);
    this.currentShape.initAbsMidpoint.add(this.oldDelta);
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
    var absMouse = new Victor(this.Mouse.state.currentX, this.Mouse.state.currentY);
    var rotDirection = absMouse.subtract(this.currentShape.initAbsMidpoint);
    this.currentShape.angle = rotDirection.angleDeg() - 90;

    // Previous way of angle computation - not so intuitive
    // this.currentShape.angle =  this.oldShape.angle - this.Mouse.state.deltaX + this.Mouse.state.deltaY;
    
    // Compute new midpoint
    var mp = this._computeMidpoint(this.currentShape.angle);
    this.currentShape.midX = mp.x;
    this.currentShape.midY = mp.y;
    
    // Compute delta from initial midpoint
    var delta = this._computeDeltaFromMidpoint(mp);

    // Compensate for delta and also oldDelta from initial rotation != 0 deg
    this.currentShape.x = this.oldShape.x - delta.x;// + this.oldDelta.x;
    this.currentShape.y = this.oldShape.y - delta.y;// + this.oldDelta.y;
  }

  finish() {
    this.currentShape = null;
    this.oldShape = null;
  }
}