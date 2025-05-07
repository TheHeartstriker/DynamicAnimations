import { useEffect, useState, useRef } from "react";
import { vertexShader, fragmentShader, initWebGL, defineBuffer } from "./Webgl";
import { getCenteredRandom, getRandomCirclePoint } from "./xyFunctions";
function Particle({ canvasRef, stateProp }) {
  const [ctx, setCtx] = useState(null);
  const programRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [colorArr, setColorArr] = useState([]);
  const colorArray = 100;
  const colorRef = useRef({
    hueMin: 0,
    hueMax: 50,
    saturation: 1,
    lightness: 0.5,
  });
  const aniTypeRef = useRef({ fire: false, circle: true });

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

  function hslToRgb(h, s, l) {
    h = h % 360;
    h /= 360;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b]; // all values are in [0, 1]
  }

  function createColorArray() {
    let colors = [];
    for (let i = 0; i < colorArray; i++) {
      let hslToRgbValue = hslToRgb(
        Math.random() * (colorRef.current.hueMax - colorRef.current.hueMin) +
          colorRef.current.hueMin,
        colorRef.current.saturation,
        colorRef.current.lightness
      );
      colors.push([hslToRgbValue[0], hslToRgbValue[1], hslToRgbValue[2]]);
    }
    setColorArr(colors);
  }

  function xandY() {
    if (aniTypeRef.current.fire) {
      return getCenteredRandom();
    } else {
      return getRandomCirclePoint(window.innerWidth, window.innerHeight, 200);
    }
  }

  function createParticleArray() {
    let particlesArray = [];
    for (let i = 0; i < 2000; i++) {
      let { x, y } = xandY();
      let particle = {
        position: [x, y],
        alpha: 1.0,
        index: Math.floor(Math.random() * colorArray),
        size: Math.random() * 5 + 1,
        velX: Math.random() * 8 - 4,
        velY: Math.random() * 8 - 4,
        sub: Math.random() * 0.01,
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
      const colorVal = colorArr[particle.index];
      gl.uniform4f(
        gl.getUniformLocation(program, "u_color"),
        colorVal[0], // Red
        colorVal[1], // Green
        colorVal[2], // Blue
        particle.alpha // Alpha
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
      particle.alpha = Math.max(0, particle.alpha - particle.sub); // Fade out alpha
      if (particle.alpha <= 0) {
        particle.alpha = 1;
        let { x, y } = xandY();
        particle.position[0] = x; // Reset X position
        particle.position[1] = y; // Reset Y position
      }
    });

    // Request the next frame
    requestAnimationFrame(() =>
      drawScene(gl, program, indices, translationLocation)
    );
  }

  function initProgramVars() {
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
    gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), 0.2);

    const translationLocation = gl.getUniformLocation(
      programRef.current,
      "u_translation"
    );
    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return { gl, program, indices, translationLocation };
  }

  useEffect(() => {
    initWebGL(canvasRef, programRef);
    if (ctx && programRef.current) {
      let { gl, program, indices, translationLocation } = initProgramVars();
      if (particles.length === 0) {
        createParticleArray();
        createColorArray();
      }
      drawScene(gl, program, indices, translationLocation);
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
          onClick={() => {
            aniTypeRef.current.fire = true;
            aniTypeRef.current.circle = false;
          }}
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
