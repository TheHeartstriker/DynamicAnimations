import { useEffect, useState, useRef } from "react";

function Particle({ ParticleProps }) {
  let { Fire } = ParticleProps;
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  // Particles array
  const [Particles, setParticles] = useState([]);
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

  function LocationX() {
    if (Fire) {
      return generateBiasedRandom(0, window.innerWidth);
    }
  }
  function LocationY() {
    if (Fire) {
      return window.innerHeight;
    }
  }

  class Particle {
    constructor() {
      this.x = LocationX();
      this.y = LocationY();
      this.vx = Math.random() * 6 - 3;
      this.vy = Math.random() * 6 - 3;
      this.alpha = 255;
      this.hue = Math.random() * 45;
      this.saturation = 50;
      this.lightness = 50;
    }
    completed() {
      return this.alpha <= 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 1;
    }
    appear() {
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 1)`;
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${
        this.lightness
      }%, ${this.alpha / 255})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < 10; i++) {
      let p = new Particle();
      Particles.push(p);
    }

    for (let i = Particles.length - 1; i >= 0; i--) {
      Particles[i].update();
      Particles[i].appear();
      if (Particles[i].completed()) {
        Particles.splice(i, 1);
      }
    }
    requestAnimationFrame(draw);
  }

  //Imporve the speed by reseting instead removing

  useEffect(() => {
    if (ctx) {
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
