import { useEffect, useState, useRef } from "react";

function Marble() {
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

  class Particle {
    constructor() {
      this.x = 300;
      this.y = 300;
      this.vx = Math.random(-1, 1);
      this.vy = Math.random(-5, -1);
      this.alpha = 255;
    }
    completed() {
      return this.alpha <= 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.5;
    }
    appear() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha / 255})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < 5; i++) {
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

export default Marble;
