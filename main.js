const windowWidth = 1280;
const windowHeight = 720;

function pentatonic(n) {
  const f0 = 110;
  return f0 * Math.pow(2, n / 12);
}

class ShapeType {
  constructor(type) {
    this.type = type;
  }
}

class Shape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(shapeType, radius = 15) {
    switch (shapeType.type) {
      case "point":
        fill("#ffffffae");
        stroke("#ffffffae");
        ellipse(this.x, this.y, radius, radius);
        break;
    }
  }
}

class Point extends Shape {
  constructor(x, y) {
    super(x, y);
    this.x = x;
    this.y = y;
  }
}

class Oscillator extends Point {
  constructor(x, y, radius, oscillatingFreq, noteFreq) {
    super(x, y, radius);
    this.x = x;
    this.y = y;
    this.r = radius;
    this.frequency = oscillatingFreq;
    this.noteFrequency = noteFreq;
  }

  angle = -1;
  direction = 1;
  frequency = 0.1;
  p5Oscillator = new p5.Oscillator("triangle");

  play() {
    this.p5Oscillator.freq(this.noteFrequency);
    this.p5Oscillator.amp(0.5, 0.05);
    this.p5Oscillator.start();
    setTimeout(() => this.p5Oscillator.amp(0, 0.05), 10);
  }
}

const origin = new Point(windowWidth / 2, windowHeight);
let oscillators = [];
let start = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  const oscillatorCount = 25;
  const pathSpacing = 20;

  for (let i = 0; i < oscillatorCount; i++) {
    const radius = 100 + pathSpacing * i;
    oscillators.push(
      new Oscillator(
        origin.x - radius * Math.cos(0),
        origin.y - radius * Math.sin(0),
        radius,
        (oscillatorCount - i / 2) / pathSpacing,
        pentatonic(oscillatorCount - i)
      )
    );
  }

  button = createButton("Start Your Drawing");
  button.mousePressed(() => (start = true));
}

function draw() {
  background(40);
  fill(255);

  if (!start) {
    return;
  }
  
  drawPaths();
  drawOscillators();
  drawFps();
}

function drawFps() {
  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), windowWidth - 100, 20);
}

function drawPaths() {
  colorMode(HSB);

  for (let i = 0; i < oscillators.length; i++) {
    const osc = oscillators[i];
    const hue = map(i, 0, oscillators.length, 300, 0);
    
    noFill();
    stroke(hue, 100, 100);
    strokeWeight(2);
    ellipse(origin.x, origin.y, 2 * osc.r, 2 * osc.r);
  }
  
  colorMode(RGB);
}

function drawOscillators() {
  oscillators.forEach((oscillator) => {
    oscillator.x =
      origin.x - oscillator.r * Math.cos((oscillator.angle * PI) / 180);
    oscillator.y =
      origin.y - oscillator.r * Math.sin((oscillator.angle * PI) / 180);

    if (oscillator.angle > 180) {
      oscillator.direction = -1;
      oscillator.play();
    }
    if (oscillator.angle < 0) {
      oscillator.direction = 1;
      oscillator.play();
    }
    
    oscillator.angle += 2 * oscillator.direction * oscillator.frequency;
  });

  oscillators.forEach((oscillator) => {
    oscillator.draw(new ShapeType("point"));
  });
}
