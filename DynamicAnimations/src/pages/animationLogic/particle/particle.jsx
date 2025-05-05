import { useEffect, useState, useRef } from "react";
import { vertexShader, fragmentShader, initWebGL } from "./FragVec";
function Particle({ canvasRef, stateProp }) {
  const [ctx, setCtx] = useState(null);
  const programRef = useRef(null);

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

  function toClipSpace(xPx, yPx) {
    let width = canvasRef.current.width;
    let height = canvasRef.current.height;
    let xClip = (xPx / width) * 2 - 1;
    let yClip = 1 - (yPx / height) * 2;
    return [xClip, yClip];
  }

  function drawParticles() {
    const gl = ctx;
    const program = programRef.current;

    // Quad vertex data: [x, y, u, v]
    const vertices = new Float32Array([
      -50.0,
      -50.0,
      0.0,
      0.0, // Bottom-left
      50.0,
      -50.0,
      1.0,
      0.0, // Bottom-right
      -50.0,
      50.0,
      0.0,
      1.0, // Top-left
      50.0,
      50.0,
      1.0,
      1.0, // Top-right
    ]);

    const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

    // Create and bind vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create and bind index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Locate and enable position attribute
    const positionLoc = gl.getAttribLocation(program, "a_position");
    const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    const translationLocation = gl.getUniformLocation(
      programRef.current,
      "u_translation"
    );

    // Enable attributes: each vertex has 4 floats (x, y, u, v)
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 4 * 4, 0);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

    // Set uniforms
    gl.useProgram(program);
    gl.uniform3f(gl.getUniformLocation(program, "u_color"), 1.0, 0.5, 0.2);
    gl.uniform1f(gl.getUniformLocation(program, "u_innerRadius"), 0.1);
    gl.uniform1f(gl.getUniformLocation(program, "u_outerRadius"), 0.5);
    gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), 0.5);

    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      gl.canvas.width,
      gl.canvas.height
    );

    gl.uniform2f(translationLocation, 0.0, 0.0); // No translation

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Draw triangles
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
