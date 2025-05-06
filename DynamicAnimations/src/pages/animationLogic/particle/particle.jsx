import { useEffect, useState, useRef } from "react";
import {
  vertexShader,
  fragmentShader,
  initWebGL,
  defineBuffer,
} from "./FragVec";
function Particle({ canvasRef, stateProp }) {
  const [ctx, setCtx] = useState(null);
  const programRef = useRef(null);
  const [particles, setParticles] = useState([]);

  //Inital canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("webgl2");
    setCtx(context);
    const resizeCanvas = () => {
      // The resize
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // After resizing the canvas, we need to get the context again
      setCtx(canvas.getContext("webgl2"));
      // Where the redrawing of the canvas happens
    };
    // Event listener where the resizeCanvas function is called
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function createParticleArray() {
    let particlesArray = [];
    for (let i = 0; i < 1000; i++) {
      let particle = {
        position: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        ],
        color: [Math.random(), Math.random(), Math.random(), 1.0],
        size: Math.random() * 5 + 1,
        velX: Math.random() * 2 - 1,
        velY: Math.random() * 2 - 1,
        sub: Math.random() * 0.01, // Speed of fading
      };
      particlesArray.push(particle);
    }
    setParticles(particlesArray);
  }

  function drawScene(gl, program, indices, translationLocation) {
    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    particles.forEach((particle) => {
      // Set the particle color
      gl.uniform4f(
        gl.getUniformLocation(program, "u_color"),
        particle.color[0], // Red
        particle.color[1], // Green
        particle.color[2], // Blue
        particle.color[3] // Alpha
      );
      // Set the particle position
      gl.uniform2f(
        translationLocation,
        particle.position[0], // X position
        particle.position[1] // Y position
      );
      // Draw the particle
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      particle.position[0] += particle.velX; // Update X position
      particle.position[1] += particle.velY; // Update Y position
      particle.color[3] = Math.max(0, particle.color[3] - particle.sub); // Fade out alpha
      if (particle.color[3] <= 0) {
        particle.color[3] = 1.0; // Reset alpha if it fades out
        particle.position[0] = Math.random() * window.innerWidth; // Reset X position
        particle.position[1] = Math.random() * window.innerHeight; // Reset Y position
      }
    });

    // Request the next frame
    requestAnimationFrame(() =>
      drawScene(gl, program, indices, translationLocation)
    );
  }

  function drawParticles() {
    const gl = ctx;
    const program = programRef.current;
    let indices = defineBuffer(gl).indices;

    //
    // Individual particle rendering
    //
    //set res
    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      gl.canvas.width,
      gl.canvas.height
    );
    // Positioning
    const positionLoc = gl.getAttribLocation(program, "a_position");
    const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 4 * 4, 0);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

    // Set uniforms
    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, "u_innerRadius"), 0.1);
    gl.uniform1f(gl.getUniformLocation(program, "u_outerRadius"), 0.5);
    gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), 0.5);

    const translationLocation = gl.getUniformLocation(
      programRef.current,
      "u_translation"
    );
    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    createParticleArray();
    if (particles.length === 0) return;
    drawScene(gl, program, indices, translationLocation);
  }

  useEffect(() => {
    initWebGL(canvasRef, programRef);
    if (ctx && programRef.current) {
      drawParticles();
    }
  }, [ctx]);

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
