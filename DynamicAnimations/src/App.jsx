import React, { useRef, useEffect, useState } from 'react';

function App() {
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const [circlearray, setCirclearray] = useState([]);
//Draw circles with predefined properties
  const drawCircle = (x, y) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.shadowColor = "white";
    ctx.shadowBlur = glow;
  }


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
//Create array of circles with manipulatable properties
setCirclearray(Array(40)
.fill()
.map(() => ({
  current: {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
  },
  target: {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
  },
  glow: {
    g: 0,
  },
  size: {
    s: Math.random() * 10,
  },
})));

  }, []);

//End of useEffect

useEffect(() => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setCirclearray.forEach(circlearray => {
      const dx = setCirclearray.target.x - setCirclearray.current.x;
      const dy = setCirclearray.target.y - setCirclearray.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      drawCircle(setCirclearray.current.x, setCirclearray.current.y);
      if (distance < 1) {
        setCirclearray.target.x = Math.floor(Math.random() * canvas.width);
        setCirclearray.target.y = Math.floor(Math.random() * canvas.height);
      }
      else {
        let lerp = 0.02;
        setCirclearraycirclearray.current.x += dx * lerp;
        setCirclearraycirclearray.current.y += dy * lerp;
      }
    });
  }, [circlearray], ctx);
  return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default App;