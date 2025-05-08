import { useEffect, useState, useRef } from "react";
import { vertexShader, fragmentShader, initWebGL, defineBuffer } from "./Webgl";
import {
  getCenteredRandom,
  getRandomCirclePoint,
  collision,
} from "./xyFunctions";
import { hslToRgb } from "./healper";
import { use } from "react";
function Particle({ canvasRef, stateProp }) {
  //State and refs
  const [ctx, setCtx] = useState(null);
  const programRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const colorArrRef = useRef([]);
  const colorArray = 100;
  const mousePosRef = useRef({ x: 0, y: 0 });
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCtx(canvas.getContext("webgl2"));
    };
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  //Controls setting of the particles aka x and y positioning
  function xandY() {
    if (aniTypeRef.current.fire) {
      return getCenteredRandom();
    } else {
      return getRandomCirclePoint(window.innerWidth, window.innerHeight, 200);
    }
  }
  //Creates a color array to optimze the color picking process
  //Every particle has a index that is used to pick a color from the color array
  //instead of generating a color when the color changes
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
    colorArrRef.current = colors;
  }
  function createParticleArray() {
    let particlesArray = [];
    for (let i = 0; i < 100; i++) {
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
  //handler for color change
  function colorChange(minrange, maxrange) {
    colorRef.current.hueMin = minrange;
    colorRef.current.hueMax = maxrange;
    colorArrRef.current = [];
    createColorArray();
  }

  function mouseAura(particle) {
    const dx = mousePosRef.current.x - particle.position[0];
    const dy = mousePosRef.current.y - particle.position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 200 && distance > 1) {
      // The closer the particle, the stronger the force
      const strength = (1 - distance / 200) * 3; // 0.5 is a tunable factor
      // Normalize direction
      const nx = dx / distance;
      const ny = dy / distance;
      // Apply force toward mouse
      particle.velX += nx * strength;
      particle.velY += ny * strength;
    }
  }

  function drawScene(gl, program, indices, translationLocation) {
    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    particles.forEach((particle) => {
      // Set the particle color
      const colorVal = colorArrRef.current[particle.index];
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

      particle.position[0] += particle.velX;
      particle.position[1] += particle.velY;
      particle.alpha = Math.max(0, particle.alpha - particle.sub);
      collision(particle, particles, 20);
      mouseAura(particle);

      if (particle.alpha <= 0) {
        particle.alpha = 1;
        let { x, y } = xandY();
        particle.position[0] = x; // Reset X position
        particle.position[1] = y; // Reset Y position
      }
    });
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
    gl.uniform1f(gl.getUniformLocation(program, "u_innerRadius"), 0.2);
    gl.uniform1f(gl.getUniformLocation(program, "u_outerRadius"), 0.5);
    gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), 0.3);

    const translationLocation = gl.getUniformLocation(
      programRef.current,
      "u_translation"
    );
    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return { gl, program, indices, translationLocation };
  }

  const anId = useRef(null);

  useEffect(() => {
    initWebGL(canvasRef, programRef);
    if (ctx && programRef.current) {
      let { gl, program, indices, translationLocation } = initProgramVars();
      if (particles.length === 0) {
        createParticleArray();
        createColorArray();
      }
      // Animation loop
      function animate() {
        anId.current = requestAnimationFrame(animate);
        drawScene(gl, program, indices, translationLocation);
      }
      animate();
      return () => {
        cancelAnimationFrame(anId.current);
      };
    }
  }, [ctx, programRef.current]);

  useEffect(() => {
    function handleMouseMove(e) {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
            colorChange(0, 50);
          }}
        >
          Red
        </div>
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() => {
            colorChange(80, 130);
          }}
        >
          Green
        </div>
        <div
          className={`CircleButton ${stateProp === false ? "Animate" : ""}`}
          onClick={() => colorChange(170, 260)}
        >
          Blue
        </div>
      </div>
      <div className="canvasBtnContainer1">
        <div
          className={`CircleButton1 ${stateProp === false ? "Animate" : ""}`}
          onClick={() => {
            aniTypeRef.current.fire = true;
            aniTypeRef.current.circle = false;
          }}
        >
          Fire
        </div>
        <div
          className={`CircleButton1 ${stateProp === false ? "Animate" : ""}`}
          onClick={() => {
            aniTypeRef.current.fire = false;
            aniTypeRef.current.circle = true;
          }}
        >
          Sun
        </div>
      </div>
    </>
  );
}

export default Particle;
