export
default class Mouse {
  constructor() {
    this.state = {
      down: false,
      moving: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0
    };
  }

  setPosition(e, startFlag) {
    if (startFlag) {
      this.state.startX = e.offsetX;
      this.state.startY = e.offsetY;
    }
    this.state.currentX = e.offsetX;
    this.state.currentY = e.offsetY;
  }

  updateDelta() {
    this.state.deltaX = this.state.currentX - this.state.startX;
    this.state.deltaY = this.state.currentY - this.state.startY;
  }

  mouseDown(e) {
    if (e.target.dataset.type) {
      this.state.down = true;
      this.setPosition(e, true);
    }
  }

  mouseUp() {
    if (this.state.moving) {
      this.state.noClick = true;
    }
    this.state.moving = false;
    this.state.down = false;
  }

  mouseMove(e) {
    if (this.state.down) {
      this.state.moving = true;
      this.setPosition(e);
      this.updateDelta(e);
    }
  }

  click() {
    if (this.state.noClick) {
      this.state.noClick = false;
      return false;
    }
    return true;
  }
}