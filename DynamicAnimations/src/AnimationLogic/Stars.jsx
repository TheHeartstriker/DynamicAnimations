// Messy react but its my first time using react I will clean it up later

import { useEffect, useRef, useState } from "react";

function Stars({ StarsProps }) {
  let { Color, Color2, Glow } = StarsProps;
  //Ctx and ref for the canvas
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  // Clean up once unmounted preventing memory leaks backround rendering errors
  const animationFrameId = useRef(null);
  // Create an array of circles with data related to them
  const [circlearray, setCirclearray] = useState(
    new Array(20).fill().map(() => ({
      current: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
      },
      target: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
      },
      size: {
        s: Math.random() * 15,
      },
      IncreaseTo: Math.random() * 15,
    }))
  );
  //Initailize the canvas
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

  // Function to draw a circle and related inputs
  function drawCircle(x, y, size) {
    if (!ctx) return;
    //Colors
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, Color);
    gradient.addColorStop(1, Color2);
    ctx.fillStyle = gradient;
    //Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    //Glow
    ctx.shadowColor = Glow;
    ctx.shadowBlur = 20;
  }
  //Drawing function
  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const newCircleArray = circlearray.map((circle) => {
      // Calculate the distance between the current and target position
      let dx = circle.target.x - circle.current.x;
      let dy = circle.target.y - circle.current.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      // Increase and decrease the size of the circle
      if (circle.size.s < circle.IncreaseTo) {
        circle.size.s += 0.02;
      } else if (circle.size.s > 1) {
        circle.size.s -= 0.02;
      }
      // Decide new target size
      if (Math.abs(circle.size.s - circle.IncreaseTo) < 1) {
        circle.IncreaseTo = Math.random() * 15;
      }
      //Reset the target position if the circle is close enough to the target
      if (distance < 1) {
        circle.target.x = Math.floor(Math.random() * window.innerWidth);
        circle.target.y = Math.floor(Math.random() * window.innerHeight);
      }
      // Move the circle towards the target position
      let lerpFactor = 0.02;
      circle.current.x += (circle.target.x - circle.current.x) * lerpFactor;
      circle.current.y += (circle.target.y - circle.current.y) * lerpFactor;
      // Actuall creation of the circle
      drawCircle(circle.current.x, circle.current.y, circle.size.s);
    });
    // Set the new circle array
    setCirclearray(newCircleArray);
    animationFrameId.current = requestAnimationFrame(update);
  }

  useEffect(() => {
    if (!ctx) return;
    update();
    // Clean up function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
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

export default Stars;
