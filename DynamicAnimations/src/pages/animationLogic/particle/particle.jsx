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
    for (let i = 0; i < 100; i++) {
      let particle = {
        position: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        ],
        color: [Math.random(), Math.random(), Math.random()],
        size: Math.random() * 5 + 1, // Random size between 1 and 6
      };
    }
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

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Draw first particle
    gl.uniform3f(gl.getUniformLocation(program, "u_color"), 1.0, 0.5, 0.5); // Color for the first particle
    gl.uniform2f(translationLocation, 150, 150); // Position of the first particle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // Draw second particle
    gl.uniform3f(gl.getUniformLocation(program, "u_color"), 0.2, 0.8, 1.0); // Color for the second particle
    gl.uniform2f(translationLocation, 300, 300); // Position of the second particle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
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
