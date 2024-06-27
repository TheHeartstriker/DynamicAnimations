import { useEffect, useState, useRef } from "react";

function Marble() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  //The array containing the ink blobs
  const [Blobs, setBlobs] = useState([]);
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

  function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  class BlobCreater {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;

      this.vertices = [];

      for (let i = 0; i < 10; i++) {
        let angle = map(i, 0, 10, 0, Math.PI * 2);
        // Directly calculate the x and y components of the vector
        let vx = this.radius * Math.cos(angle);
        let vy = this.radius * Math.sin(angle);

        // Multiply the components by radius (though it seems redundant here, adjust as needed)
        vx *= this.radius;
        vy *= this.radius;

        // Add this.x and this.y to the components
        vx += this.x;
        vy += this.y;

        // Store the vector as an object with x and y properties
        this.vertices[i] = { x: vx, y: vy };
      }
    }

    imprint() {
      if (this.vertices.length > 0) {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y); // Move to the first vertex

        // Loop through the vertices and draw lines
        for (let i = 1; i < this.vertices.length; i++) {
          ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }

        ctx.closePath(); // Close the path
        ctx.fillStyle = "blue"; // Set the fill color
        ctx.fill(); // Fill the shape
        // ctx.stroke(); // Optionally, outline the shape
      }
    }
  }

  function drawBlobs() {
    if (!ctx) return;
    Blobs.forEach((Blob) => {
      Blob.imprint();
    });
  }

  useEffect(() => {
    if (!ctx) return;
    drawBlobs();
  }, [ctx, Blobs]);

  useEffect(() => {
    if (!ctx) return;

    const handleClick = (event) => {
      const newBlob = new BlobCreater(event.clientX, event.clientY, 10);
      setBlobs((prevBlobs) => [...prevBlobs, newBlob]);
    };

    canvasRef.current.addEventListener("click", handleClick);

    return () => {
      canvasRef.current.removeEventListener("click", handleClick);
    };
  }, [ctx]);

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
