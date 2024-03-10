let ball;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = new Ball(50, 50, 40);
  noStroke();
  fill("rgb(255,226,0)");
}

function draw() {
  clear(); // This will clear the canvas and make the background transparent
  ball.update();
  ball.attract();
  ball.edges();
  ball.friction();
  ball.render();
}


class Ball {
  constructor(x, y, size) {
    this.p = createVector(x, y);
    this.size = size;
    this.v = createVector(0, 0);
    this.a = createVector(0, 0.5);
    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
    this.mouseStopped = false;
  }
  
  update() {
    this.v.add(this.a);
    this.p.add(this.v);
    // Apply additional damping if the mouse has stopped
    if (this.mouseStopped) {
      this.v.mult(0.95); // Increase the damping factor to make the ball stop more quickly
    }
    this.a.setMag(0);
  }
  
  edges() {
    if (this.p.y + this.size / 2 >= height) {
      this.p.y = height - this.size / 2;
      this.v.y *= -1;
    }
  }
  
  friction() {
    this.v.mult(0.98);
  }
  
  attract() {
    const mouse = createVector(mouseX, mouseY);
    if (mouseX !== this.prevMouseX || mouseY !== this.prevMouseY) {
      const fromBallToMouse = p5.Vector.sub(mouse, this.p);
      fromBallToMouse.setMag(0.5);
      this.a.add(fromBallToMouse);
      this.mouseStopped = false;
    } else {
      // When the mouse stops, enable a flag to apply additional damping
      this.mouseStopped = true;
      // Apply a gentle force towards the mouse to ensure it stops at the mouse position
      const fromBallToMouse = p5.Vector.sub(mouse, this.p);
      const distance = fromBallToMouse.mag();
      if (distance > 1) { // Apply the force only if the ball is not too close to avoid overshooting
        fromBallToMouse.setMag(0.5);
        this.a.add(fromBallToMouse);
      }
    }

    // Update the previous mouse positions for the next frame
    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
  }
  
  render() {
    ellipse(this.p.x, this.p.y, this.size);
  }
}
