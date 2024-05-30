// Messy react but its my first time using react I will clean it up later

import { useEffect, useRef, useState } from "react";

function Stars() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  // Create an array of circles with data related to them
  const [circlearray, setCirclearray] = useState(
    new Array(40).fill().map(() => ({
      current: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
      },
      target: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
      },
      size: {
        s: Math.random() * 10,
      },
      IncreaseTo: Math.random() * 10,
    }))
  );
  // Resize the canvas to fit the window
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
    ctx.fillStyle = "";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.shadowColor = "white";
    ctx.shadowBlur = 5;
  }
  // Create the update function
  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let newCircleArray = [...circlearray]; // Create a copy of circlearray to use setState
    newCircleArray.forEach((circle) => {
      let dx = circle.target.x - circle.current.x;
      let dy = circle.target.y - circle.current.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (circle.size.s < circle.IncreaseTo) {
        circle.size.s += 0.02;
      } else if (circle.size.s > 1) {
        circle.size.s -= 0.02;
      }

      if (Math.abs(circle.size.s - circle.IncreaseTo) < 1) {
        circle.IncreaseTo = Math.random() * 10;
      }

      drawCircle(circle.current.x, circle.current.y, circle.size.s);
      if (distance < 1) {
        circle.target.x = Math.floor(Math.random() * window.innerWidth);
        circle.target.y = Math.floor(Math.random() * window.innerHeight);
      } else {
        let lerpFactor = 0.02;
        circle.current.x += (circle.target.x - circle.current.x) * lerpFactor;
        circle.current.y += (circle.target.y - circle.current.y) * lerpFactor;
      }
    });

    setCirclearray(newCircleArray); // Update the state with the modified copy
    requestAnimationFrame(update);
  }

  useEffect(() => {
    if (!ctx) return;
    update();
    console.log("update");
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
