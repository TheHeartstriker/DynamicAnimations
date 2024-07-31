import { useEffect, useState, useRef } from "react";

function Particle({ ParticleProps }) {
  let { Fire, SunOn } = ParticleProps;
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  // Particles array
  const [Particles, setParticles] = useState([]);
  //Sun points
  const [Sun, setSun] = useState(false);
  useEffect(() => {
    // Creates a refrence to current canvas
    const canvas = canvasRef.current;
    // Sets the default canvas size to the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Gets the context of the canvas
    const context = canvas.getContext("2d");
    // Sets the context to the state
    setCtx(context);
    // Function to resize the canvas
    const resizeCanvas = () => {
      // The resize
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // After resizing the canvas, we need to get the context again
      setCtx(canvas.getContext("2d"));
      // Where the redrawing of the canvas happens
    };
    // Event listener where the resizeCanvas function is called
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function generateBiasedRandom(min, max) {
    const mean = (max + min) / 2;
    const standardDeviation = (max - min) / 6; // Assuming 99.7% values within [min, max]

    let rand;
    do {
      rand = generateGaussianRandom(mean, standardDeviation);
    } while (rand < min || rand > max); // Ensure the value is within [min, max]

    return rand;
  }

  function generateGaussianRandom(mean = 0, standardDeviation = 1) {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Convert to the desired mean and standard deviation
    return num * standardDeviation + mean;
  }

  function SunArea() {
    const CenterX = window.innerWidth / 2;
    const CenterY = window.innerHeight / 2;
    const Radius = 250;
    const step = 1;
    let newSun = []; // Temporary array to hold new sun points
    for (let x = CenterX - Radius; x <= CenterX + Radius; x += step) {
      for (let y = CenterY - Radius; y <= CenterY + Radius; y += step) {
        const distanceFromCenter = Math.sqrt(
          (x - CenterX) ** 2 + (y - CenterY) ** 2
        );
        if (distanceFromCenter <= Radius) {
          newSun.push({ x, y });
        }
      }
    }
    setSun(newSun); // Update the state with the new sun points
  }

  function SunPoint() {
    if (Sun && Sun.length > 0) {
      const Index = Math.floor(Math.random() * Sun.length);
      return Sun[Index];
    }
    return null;
  }

  function LocationX() {
    if (Fire) {
      return generateBiasedRandom(0, window.innerWidth);
    }
    if (SunOn) {
      const point = SunPoint();
      if (Sun) {
        return point ? point.x : null;
      }
    }
  }
  function LocationY() {
    if (Fire) {
      return window.innerHeight;
    }
    if (SunOn) {
      const point = SunPoint();
      if (Sun) {
        return point ? point.y : null;
      }
    }
  }

  //webworkers somewhere
  //If slow make larger

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = LocationX();
      this.y = LocationY();
      this.vx = Math.random() * 8 - 4;
      this.vy = Math.random() * 8 - 4;
      this.alpha = 255;
      this.hue = Math.random() * (260 - 190) + 190;
      this.saturation = 50;
      this.lightness = 50;
      this.Subtract = Math.random() * 5 + 1;
    }
    completed() {
      if (this.alpha <= 0) {
        this.reset();
      }
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.Subtract;
    }
    appear() {
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${
        this.lightness
      }%, ${this.alpha / 255})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  //Consider calling with delay
  function createParticles() {
    for (let i = 0; i < 5000; i++) {
      Particles.push(new Particle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < Particles.length; i++) {
      Particles[i].update();
      Particles[i].completed();
      Particles[i].appear();
    }
    requestAnimationFrame(draw);
  }

  useEffect(() => {
    if (SunOn) {
      SunArea();
    }
  }, [ctx]);

  useEffect(() => {
    if (ctx) {
      createParticles();
      draw();
    }
  }, [ctx]);

  return (
    <canvas
      ref={canvasRef}
      id="myCanvas"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

export default Particle;
