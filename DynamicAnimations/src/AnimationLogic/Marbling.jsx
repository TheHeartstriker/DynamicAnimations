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

  class Vector {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    // Add a vector to this one
    add(v) {
      if (v instanceof Vector) {
        this.x += v.x;
        this.y += v.y;
      } else {
        this.x += v;
        this.y += v;
      }
      return this;
    }

    // Subtract a vector from this one
    sub(v) {
      if (v instanceof Vector) {
        this.x -= v.x;
        this.y -= v.y;
      } else {
        this.x -= v;
        this.y -= v;
      }
      return this;
    }

    // Multiply this vector by a scalar
    mult(n) {
      this.x *= n;
      this.y *= n;
      return this;
    }

    // Divide this vector by a scalar
    div(n) {
      this.x /= n;
      this.y /= n;
      return this;
    }

    // Calculate the magnitude (length) of the vector
    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Set the magnitude of this vector
    setMag(n) {
      return this.normalize().mult(n);
    }

    // Normalize the vector to length 1 (make it a unit vector)
    normalize() {
      let len = this.mag();
      if (len !== 0) this.mult(1 / len);
      return this;
    }

    // Limit the magnitude of this vector
    limit(max) {
      if (this.mag() > max) {
        this.setMag(max);
      }
      return this;
    }

    // Calculate the distance between this vector and another one
    static dist(v1, v2) {
      let dx = v1.x - v2.x;
      let dy = v1.y - v2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate the angle of rotation for this vector
    heading() {
      return Math.atan2(this.y, this.x);
    }

    // Rotate the vector by an angle (in radians)
    rotate(a) {
      let newHeading = this.heading() + a;
      let mag = this.mag();
      this.x = Math.cos(newHeading) * mag;
      this.y = Math.sin(newHeading) * mag;
      return this;
    }

    // Linear interpolate the vector to another vector
    lerp(x, y, amt) {
      this.x += (x - this.x) * amt;
      this.y += (y - this.y) * amt;
      return this;
    }

    // Copy the vector
    copy() {
      return new Vector(this.x, this.y);
    }

    // Static method to create a vector from an angle
    static fromAngle(angle, length) {
      if (typeof length === "undefined") {
        length = 1;
      }
      return new Vector(length * Math.cos(angle), length * Math.sin(angle));
    }
  }
  const circleDetail = 100;

  class BlobCreater {
    constructor(x, y, radius) {
      // Center position of the drop
      this.center = new Vector(x, y);
      // Radius of the drop
      this.radius = radius;
      // Calculate vertices based on circle detail and radius
      this.vertices = [];
      for (let i = 0; i < circleDetail; i++) {
        let angle = map(i, 0, circleDetail, 0, Math.PI * 2);
        let v = new Vector(Math.cos(angle), Math.sin(angle));
        v.mult(this.radius);
        v.add(this.center);
        this.vertices[i] = v;
      }
    }

    Marble(Other) {
      for (let v of this.vertices) {
        let c = Other.center;
        let r = Other.radius;
        let p = v.copy();
        p.sub(c);
        let m = p.mag();
        let root = Math.sqrt(1 + (r * r) / (m * m));
        p.mult(root);
        p.add(c);
        v.x = p.x;
        v.y = p.y;
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
      const newBlob = new BlobCreater(event.clientX, event.clientY, 50);

      for (let Other of Blobs) {
        Other.Marble(newBlob);
      }

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
