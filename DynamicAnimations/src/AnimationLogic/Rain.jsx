import { useState, useEffect, useRef } from "react";

function Rain({ RainProps, LightningProps }) {
  let {
    Distance,
    Thickness,
    Time,
    Branches,
    Roughness,
    Chance,
    Hue,
    Sat,
    Light,
  } = LightningProps;
  // Create references to the canvases two are needed on differet layers
  const rainCanvasRef = useRef(null);
  const lightningCanvasRef = useRef(null);
  // Create states for the contexts
  const [rainCtx, setRainCtx] = useState(null);
  const [lightningCtx, setLightningCtx] = useState(null);
  //Call a reset on lightning
  const [Reset, setReset] = useState(false);
  //Ids for the timeouts very important to clear them
  const [Ids, setIds] = useState([]);
  // Clean up once unmounted preventing memory leaks backround rendering
  const animationFrameId = useRef(null);
  // Wind speed
  const windSpeed = RainProps.WindSpeed || 0;
  const wind = RainProps.Wind || false;
  // The rain array
  const [rainArray, setRainArray] = useState(
    new Array(RainProps.DROPS).fill().map(() => {
      const startX = Math.floor(Math.random() * window.innerWidth);
      const startY = Math.floor(Math.random() * window.innerHeight);
      return {
        Start: {
          x: startX,
          y: startY,
        },
        speed: Math.random() * 5 + 5,
        x2: startX + windSpeed,
        y2: startY + RainProps.HEIGHT / (Math.floor(Math.random() * 3) + 1),
      };
    })
  );
  //Creates a canvas
  useEffect(() => {
    // Creates references to current canvases
    const rainCanvas = rainCanvasRef.current;
    const lightningCanvas = lightningCanvasRef.current;
    // Sets the default canvas sizes to the window size
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    lightningCanvas.width = window.innerWidth;
    lightningCanvas.height = window.innerHeight;
    // Gets the contexts of the canvases
    const rainContext = rainCanvas.getContext("2d");
    const lightningContext = lightningCanvas.getContext("2d");
    // Sets the contexts to the states
    setRainCtx(rainContext);
    setLightningCtx(lightningContext);
    // Function to resize the canvas
    const resizeCanvas = () => {
      // The resize
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
      lightningCanvas.width = window.innerWidth;
      lightningCanvas.height = window.innerHeight;
      // After resizing the canvas, we need to get the context again
      setRainCtx(rainCanvas.getContext("2d"));
      setLightningCtx(lightningCanvas.getContext("2d"));
      // Where the redrawing of the canvas happens
    };
    // Event listener where the resizeCanvas function is called
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Drop constructor
  function Droplet(x1, y1, x2, y2) {
    let gradient = rainCtx.createLinearGradient(x1, y1, x2, y2);

    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "blue");
    rainCtx.beginPath();
    rainCtx.moveTo(x1, y1);
    rainCtx.lineTo(x2, y2);
    rainCtx.lineWidth = RainProps.DROPWIDTH;
    rainCtx.strokeStyle = gradient;
    rainCtx.fill();
    rainCtx.stroke();
  }
  //Function to draw the rain
  function DrawDroplets() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    rainCtx.clearRect(0, 0, width, height);

    const newRainArray = rainArray.map((drop) => {
      drop.Start.y += drop.speed;
      drop.y2 += drop.speed;
      if (wind) {
        drop.Start.x += 1.5;
        drop.x2 += 1.5;
      }

      Droplet(drop.Start.x, drop.Start.y, drop.x2, drop.y2);

      if (drop.y2 > height) {
        drop.Start.x = Math.floor(Math.random() * width);
        drop.Start.y = 0;
        drop.x2 = drop.Start.x + windSpeed;
        drop.y2 = RainProps.HEIGHT / (Math.floor(Math.random() * 3) + 1);
      }

      return drop;
    });

    setRainArray(newRainArray);
    animationFrameId.current = requestAnimationFrame(DrawDroplets);
  }
  //Function that draws the lightning bolt
  function Zeus(startX, startY, Thickness, Branches, Distance) {
    // Creates local references to the variables
    let Check = Roughness;
    let currentDistance = Distance;
    let currentThickness = Thickness;
    let currentTime = Math.floor(Math.random() * Time) + 50;
    let accumulate = 0;
    let currentBranches = Branches;
    let Glow = currentThickness * 3;

    for (let i = 0; i < Roughness; i++) {
      accumulate += currentTime / 2;
      let timeoutId = setTimeout(() => {
        //Drawing values
        lightningCtx.beginPath();
        lightningCtx.shadowBlur = Glow;
        lightningCtx.shadowColor = `hsl(${Hue}, ${Sat}%, ${Light}%)`;
        lightningCtx.strokeStyle = `hsl(${Hue}, ${Sat}%, ${Light}%)`;
        lightningCtx.lineWidth = currentThickness;
        //Drawing logic
        lightningCtx.moveTo(startX, startY);
        let endX = startX + PosNegConverter(currentDistance);
        let endY = startY + Math.random() * currentDistance * 1.5;
        lightningCtx.lineTo(endX, endY);
        // Update startX and startY here
        startX = endX;
        startY = endY;
        lightningCtx.stroke();
        //Branching logic
        if (currentBranches > 0 && BranchChance(Check) === true && i < 99) {
          currentBranches -= 1;
          Branch(
            startX,
            startY,
            currentThickness,
            currentBranches,
            currentDistance
          );
        }
        //Update values decreasing thickness and distance and increasing accumulation time
        Glow - 0.5;
        currentThickness /= 1.1;
        currentDistance /= 1.1;
        currentTime *= 1.1;
        //Calls a redraw when the loop is finished
        if (i === Roughness - 1) {
          ReDraw();
        }
      }, accumulate);
      //Pushes the timeout id to the array
      setIds((prev) => [...prev, timeoutId]);
    }
  }

  function clearAllTimeouts() {
    Ids.forEach((id) => clearTimeout(id));
    setIds([]);
  }

  //Fucntion to draw the branches
  function Branch(End1, End2, Thick, Branches, Distance) {
    Zeus(End1, End2, Thick, Branches, Distance);
  }
  //Controls the branching chance as the iteration increases
  //Imatatates naturaly occuring lightning logic
  function BranchChance(Check) {
    Check -= 1;
    if (Math.random() * Check < Chance) {
      return true;
    }
  }
  //Function to convert a positive or negative value used to introduce randomness
  function PosNegConverter(A) {
    if (Math.random() < 0.5) {
      return A * -1;
    }
    return A;
  }
  //Function to redraw the lightning
  function ReDraw() {
    if (Reset === true) {
      setReset(false);
    } else {
      setReset(true);
    }
  }
  //Draws the rain
  useEffect(() => {
    if (!rainCtx) {
      return;
    }
    DrawDroplets();
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [rainCtx]);

  useEffect(() => {
    if (!lightningCtx) {
      return;
    }
    //Defines the flash part of the lightning
    const Refrence = lightningCanvasRef.current;
    Refrence.style.animation = "none";
    void Refrence.offsetHeight;
    if (Refrence) {
      Refrence.style.animation = "Flash";
      Refrence.style.animationDuration = "1s";
    }
    //Where the lightning is drawn
    lightningCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    clearAllTimeouts();
    Zeus(
      300 + Math.random() * (window.innerWidth - 600),
      0,
      Thickness,
      Branches,
      Distance
    );
    // Clean up
    return () => {
      clearAllTimeouts();
    };
  }, [lightningCtx, Reset]);

  return (
    <div>
      <canvas
        ref={rainCanvasRef}
        style={{ position: "absolute" }}
        id="rainCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <canvas
        ref={lightningCanvasRef}
        style={{ position: "absolute" }}
        id="lightningCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}

export default Rain;
