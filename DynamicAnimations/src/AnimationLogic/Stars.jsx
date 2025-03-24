// Messy react but its my first time using react I will clean it up later

import { useEffect, useRef, useState } from "react";

function Stars({ canvasRef, stateProp }) {
  // let { Color, Color2, Glow, Linear, Lerp, NonLinear } = StarsProps;
  const AnimateControl = useRef({
    Color: "Blue",
    Color2: "Teal",
    Glow: "Teal",
    Linear: true,
    Lerp: false,
    NonLinear: false,
  });
  //Ctx and ref for the canvas
  const [ctx, setCtx] = useState(null);
  // Clean up once unmounted preventing memory leaks backround rendering errors
  const animationFrameId = useRef(null);
  const [Mouse, setMouse] = useState({ x: 0, y: 0 });
  const [MouseDown, setMouseDown] = useState(false);
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
      MoveVal: Math.random() * 5,
      velocity: {
        x: 0,
        y: 0,
      },
    }))
  );

  //Event listeners for mouse down and up
  const handleMouseDown = () => {
    setMouseDown(true);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    setMouse({ x: event.clientX, y: event.clientY });
  };

  // Initialize the canvas
  useEffect(() => {
    // Creates a reference to current canvas
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
    gradient.addColorStop(0, AnimateControl.current.Color);
    gradient.addColorStop(1, AnimateControl.current.Color2);
    ctx.fillStyle = gradient;
    //Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    //Glow
    ctx.shadowColor = AnimateControl.current.Glow;
    ctx.shadowBlur = size * 5;
  }

  const Gravity = 9.8;
  //Drawing function
  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const newCircleArray = circlearray.map((circle, index) => {
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
      // Call the Linear movement function which handles the movement of the circle if a linear type movement is selected
      //Have this and gravity on aka non linear allows for a more natural movement
      if (AnimateControl.current.Linear || AnimateControl.current.Lerp)
        LinearMovment(distance, dx, dy, circle);
      if (AnimateControl.current.NonLinear) {
        // Apply gravity the passive downward force
        circle.velocity.y += (Gravity * circle.size.s) / 60;
        // Additional downward force based on the velocity
        circle.current.y += circle.velocity.y / 60;
        circle.current.x += circle.velocity.x / 60;

        // Handle ground collision
        if (circle.current.y > window.innerHeight) {
          circle.current.y = window.innerHeight;
          circle.velocity.y = 0; // Reset velocity on collision
        }

        // Check for collisions with other circles
        CollisionDetection(index);
      }

      // Actuall creation of the circle
      drawCircle(circle.current.x, circle.current.y, circle.size.s);
    });
    // Set the new circle array
    setCirclearray(newCircleArray);
    animationFrameId.current = requestAnimationFrame(update);
  }

  function CollisionDetection(Circle) {
    const newCircleArray = [...circlearray];
    for (let i = 0; i < newCircleArray.length; i++) {
      if (i !== Circle) {
        let dx = newCircleArray[i].current.x - newCircleArray[Circle].current.x;
        let dy = newCircleArray[i].current.y - newCircleArray[Circle].current.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let combinedRadius =
          newCircleArray[i].size.s + newCircleArray[Circle].size.s;
        if (distance < combinedRadius) {
          let overlap = 0.5 * (combinedRadius - distance);
          // Displacement of current circle
          newCircleArray[Circle].current.x -= overlap * (dx / distance);
          newCircleArray[Circle].current.y -= overlap * (dy / distance);
          // Displacement of connected circle
          newCircleArray[i].current.x += overlap * (dx / distance);
          newCircleArray[i].current.y += overlap * (dy / distance);
        }
      }
    }
    setCirclearray(newCircleArray);
  }

  function LinearMovment(distance, dx, dy, circle) {
    //Reset the target position if the circle is close enough to the target
    if (distance < circle.MoveVal) {
      circle.target.x = Math.floor(Math.random() * window.innerWidth);
      circle.target.y = Math.floor(Math.random() * window.innerHeight);
    }
    // Move the circle towards the target position
    if (AnimateControl.current.Linear) {
      let directionX = dx / distance;
      let directionY = dy / distance;
      circle.current.x += directionX * circle.MoveVal;
      circle.current.y += directionY * circle.MoveVal;
    }
    if (AnimateControl.current.Lerp) {
      let lerpFactor = 0.01;
      circle.current.x += (circle.target.x - circle.current.x) * lerpFactor;
      circle.current.y += (circle.target.y - circle.current.y) * lerpFactor;
    }
  }

  function AniChangeClick(color, color2, glow, linear, lerp, nonLinear) {
    AnimateControl.current.Color = color;
    AnimateControl.current.Color2 = color2;
    AnimateControl.current.Glow = glow;
    AnimateControl.current.Linear = linear;
    AnimateControl.current.Lerp = lerp;
    AnimateControl.current.NonLinear = nonLinear;
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
    <>
      <canvas
        ref={canvasRef}
        className="myCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      ></canvas>
      <div className="canvasBtnContainer">
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() =>
            AniChangeClick("Red", "Orange", "Orange", false, true, false)
          }
        >
          Lerp
        </div>
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() =>
            AniChangeClick("Green", "Yellow", "lightgreen", true, false, true)
          }
        >
          Goofy Gravity
        </div>
      </div>
    </>
  );
}

export default Stars;
