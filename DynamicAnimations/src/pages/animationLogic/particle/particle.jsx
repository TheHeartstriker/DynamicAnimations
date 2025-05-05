import { useEffect, useState, useRef } from "react";
import { vertexShader, fragmentShader } from "./FragVec";
function Particle({ canvasRef, stateProp }) {
  const [ctx, setCtx] = useState(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  //Inital canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("webgl");
    setCtx(context);
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

  // function initWebGL() {
  //   const canvas = canvasRef.current;
  //   const gl =
  //     canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  //   if (!gl) {
  //     console.error("WebGL not supported");
  //     return;
  //   }

  //   // Compile the vertex shader
  //   const vertexShaderObj = gl.createShader(gl.VERTEX_SHADER);
  //   gl.shaderSource(vertexShaderObj, vertexShader);
  //   gl.compileShader(vertexShaderObj);
  //   if (!gl.getShaderParameter(vertexShaderObj, gl.COMPILE_STATUS)) {
  //     console.error(
  //       "Error compiling vertex shader:",
  //       gl.getShaderInfoLog(vertexShaderObj)
  //     );
  //     return;
  //   }

  //   // Compile the fragment shader
  //   const fragmentShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
  //   gl.shaderSource(fragmentShaderObj, fragmentShader);
  //   gl.compileShader(fragmentShaderObj);
  //   if (!gl.getShaderParameter(fragmentShaderObj, gl.COMPILE_STATUS)) {
  //     console.error(
  //       "Error compiling fragment shader:",
  //       gl.getShaderInfoLog(fragmentShaderObj)
  //     );
  //     return;
  //   }

  //   // Create and link the WebGL program
  //   const program = gl.createProgram();
  //   gl.attachShader(program, vertexShaderObj);
  //   gl.attachShader(program, fragmentShaderObj);
  //   gl.linkProgram(program);
  //   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  //     console.error("Error linking program:", gl.getProgramInfoLog(program));
  //     return;
  //   }
  //   gl.useProgram(program);

  //   // Set up the buffer for particle positions
  //   const positionBuffer = gl.createBuffer();
  //   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  //   // Example particle positions (you can dynamically generate these)
  //   const positions = [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5];
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //   // Bind the position buffer to the shader's `a_position` attribute
  //   const positionLocation = gl.getAttribLocation(program, "a_position");
  //   gl.enableVertexAttribArray(positionLocation);
  //   gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  //   // Set the uniform color (example: red)
  //   const colorLocation = gl.getUniformLocation(program, "u_color");
  //   gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0); // RGBA

  //   // Clear the canvas and draw
  //   gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
  //   gl.clear(gl.COLOR_BUFFER_BIT);
  //   gl.drawArrays(gl.POINTS, 0, positions.length / 2);
  // }

  function drawParticle(x, y, color, glow) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2, false);
    const [r, g, b, a] = color;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    // Declare shadowColor before using it
    const shadowColor = `rgba(${r}, ${g}, ${b}, ${a * 0.5})`;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = glow;
    ctx.fill();
  }

  function initParticles() {
    if (!ctx) return;
    console.log("Initializing particles");
    particlesRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      xVel: Math.random() * 8 - 4,
      yVel: Math.random() * 8 - 4,
      color: [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.random(),
      ],
      glow: Math.random() * 20 + 5,
    }));
  }

  function resetParticle(particle) {
    particle.x = Math.random() * window.innerWidth;
    particle.y = Math.random() * window.innerHeight;
    particle.xVel = Math.random() * 8 - 4;
    particle.yVel = Math.random() * 8 - 4;
    particle.color = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.random(),
    ];
    particle.glow = Math.random() * 20 + 5;
  }

  function updateParticles() {
    if (!ctx || particlesRef.current.length === 0) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particlesRef.current.forEach((particle) => {
      particle.x += particle.xVel * 0.1;
      particle.y += particle.yVel * 0.1;
      particle.color[3] -= 0.001;
      drawParticle(particle.x, particle.y, particle.color, particle.glow);
      if (particle.color[3] <= 0) {
        resetParticle(particle);
      }
    });
  }

  useEffect(() => {
    initWebGL();
  }, [ctx]);

  // useEffect(() => {
  //   if (!ctx) return;
  //   if (particlesRef.current.length === 0) {
  //     initParticles();
  //   }
  //   function animate() {
  //     updateParticles();
  //     animationFrameId.current = requestAnimationFrame(animate);
  //   }

  //   // Start the animation loop
  //   animationFrameId.current = requestAnimationFrame(animate);

  //   return () => {
  //     // Cleanup the animation frame on unmount
  //     cancelAnimationFrame(animationFrameId.current);
  //   };
  // }, [ctx]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="myCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="canvasBtnContainer">
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() => OnClickHandle(140, 260, undefined, undefined)}
        >
          Bluish
        </div>
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() => OnClickHandle(70, 140, undefined, undefined)}
        >
          Green
        </div>
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() => OnClickHandle(0, 60, undefined, undefined)}
        >
          Red
        </div>
      </div>
    </>
  );
}

export default Particle;
