import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [circlearray, setCirclearray] = useState(new Array(40)
  .fill()
  .map(() => ({
    current: {
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
    },
    target: {
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
    },
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function drawCircle(x, y) {
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.shadowColor = "white";
    ctx.shadowBlur = 5;
  }

  useEffect(() => {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    setCirclearray((prevCircles) => prevCircles.map((circle) => {
      let dx = circle.target.x - circle.current.x;
      let dy = circle.target.y - circle.current.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      drawCircle(circle.current.x, circle.current.y);
      if (distance < 1) {
        circle.target.x = Math.floor(Math.random() * window.innerWidth);
        circle.target.y = Math.floor(Math.random() * window.innerHeight);
      } else {
        let lerpFactor = 0.02;
        circle.current.x += (circle.target.x - circle.current.x) * lerpFactor;
        circle.current.y += (circle.target.y - circle.current.y) * lerpFactor;
      }
      return circle;
    }));
  }, [ctx, circlearray]);

  return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default App;