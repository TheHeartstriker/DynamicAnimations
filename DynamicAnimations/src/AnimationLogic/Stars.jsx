// Messy react but its my first time using react I will clean it up later

import { useEffect, useRef, useState } from "react";

function Stars({ StarsProps }) {
  let { Color } = StarsProps;
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
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
        s: Math.random() * 10,
      },
      IncreaseTo: Math.random() * 10,
    }))
  );

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
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "orange");

    ctx.fillStyle = gradient;
    ctx.beginPath();

    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.shadowColor = "red";
    ctx.shadowBlur = 20;
  }
  // Create the update function
  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const newCircleArray = circlearray.map((circle) => {
      // Calculate the distance between the current and target position
      let dx = circle.target.x - circle.current.x;
      let dy = circle.target.y - circle.current.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      // Increase the size of the circle
      if (circle.size.s < circle.IncreaseTo) {
        circle.size.s += 0.02;
      } else if (circle.size.s > 1) {
        circle.size.s -= 0.02;
      }

      if (Math.abs(circle.size.s - circle.IncreaseTo) < 1) {
        circle.IncreaseTo = Math.random() * 20;
      }
      //Reset the target position if the circle is close enough to the target
      if (distance < 1) {
        circle.target.x = Math.floor(Math.random() * window.innerWidth);
        circle.target.y = Math.floor(Math.random() * window.innerHeight);
      }
      // Check if the circle is close to another circle
      if (Has(circlearray, circle.target.x, circle.target.y, circle)) {
        circle.target.x = Math.floor(Math.random() * window.innerWidth);
        circle.target.y = Math.floor(Math.random() * window.innerHeight);
      }
      let lerpFactor = 0.02;
      circle.current.x += (circle.target.x - circle.current.x) * lerpFactor;
      circle.current.y += (circle.target.y - circle.current.y) * lerpFactor;

      drawCircle(circle.current.x, circle.current.y, circle.size.s);
    });

    setCirclearray(newCircleArray); // Update the state with the modified copy
    requestAnimationFrame(update);
  }

  function Has(arr, x, y, currentCircle) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === currentCircle) continue; // Skip if it's the same circle

      let DiffX = Math.abs(arr[i].current.x - x);
      let DiffY = Math.abs(arr[i].current.y - y);
      let distanceBetweenCenters = Math.sqrt(DiffX * DiffX + DiffY * DiffY);

      // Calculate the distance between the edges of the circles
      let combinedRadius = arr[i].size.s / 2 + currentCircle.size.s / 2;
      let distanceBetweenEdges = distanceBetweenCenters - combinedRadius;

      // Check if the distance between edges is less than a threshold
      if (distanceBetweenEdges < 1) {
        // You can adjust this threshold as needed
        return true;
      }
    }
    return false;
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
