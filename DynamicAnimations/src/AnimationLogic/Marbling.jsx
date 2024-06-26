import { useEffect, useState, useRef } from "react";

function Marble() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  //The array containing the ink blobs
  const [Globs, setGlobs] = useState([]);
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

  class GlobCreater {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    }

    imprint() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = "blue";
      ctx.fill();
    }
  }

  function MousePress() {
    if (!ctx) return;
    canvas.addEventListener("click", function (event) {
      let newGlob = new GlobCreater(event.clientX, event.clientY, 30);
      setGlobs([...Globs, newGlob]);
    });
  }

  function drawGlobs() {
    if (!ctx) return;
    Globs.forEach((Glob) => {
      Glob.imprint();
    });
  }

  return (
    <canvas
      ref={canvasRef}
      id="myCanvas"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

export default Marble;
