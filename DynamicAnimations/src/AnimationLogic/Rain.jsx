import { useState, useEffect, useRef } from "react";

function Rain({ DROPS, RainProps, LightningProps }) {
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
  // Create references to the canvases
  const rainCanvasRef = useRef(null);
  const lightningCanvasRef = useRef(null);
  // Create states for the contexts
  const [rainCtx, setRainCtx] = useState(null);
  const [lightningCtx, setLightningCtx] = useState(null);
  // The rain array
  const [rainArray, setRainArray] = useState(
    new Array(DROPS).fill().map(() => ({
      Start: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: 0,
      },
      speed: Math.random() * 5 + 5,
      width: RainProps.WIDTH,
      height: RainProps.HEIGHT / Math.floor(Math.random() * RainProps.SHEET),
    }))
  );

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
  function Droplet(x1, y1, width, height) {
    rainCtx.beginPath();
    rainCtx.rect(x1, y1, width, height);
    rainCtx.lineWidth = RainProps.DROPWIDTH;
    rainCtx.strokeStyle = "gray";
    rainCtx.fillStyle = "blue";
    rainCtx.fill();
    rainCtx.stroke();
  }

  // Animation function so rules etc can be applied
  function DrawDroplets() {
    rainCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const newRainArray = rainArray.map((drop) => {
      const newDrop = drop;
      newDrop.Start.y += newDrop.speed;

      Droplet(newDrop.Start.x, newDrop.Start.y, newDrop.width, newDrop.height);
      if (newDrop.Start.y > window.innerHeight) {
        newDrop.Start.x = Math.floor(Math.random() * window.innerWidth);
        newDrop.Start.y = 0;
      }
      return newDrop;
    });
    setRainArray(newRainArray);

    requestAnimationFrame(DrawDroplets);
  }

  const [Reset, setReset] = useState(false);

  let timeoutIds = [];

  function Zeus(startX, startY, Thickness, Branches, Distance, Iterator) {
    // Creates local references to the variables
    let Check = Roughness;
    let currentDistance = Distance;
    let currentThickness = Thickness;
    let currentTime = Math.floor(Math.random() * Time) + 50;
    let accumulate = 0;
    let currentBranches = Branches;
    let Glow = 20;

    for (let i = Iterator; i < Roughness; i++) {
      accumulate += currentTime / 2;
      let timeoutId = setTimeout(() => {
        //Drawing values
        lightningCtx.beginPath();
        lightningCtx.shadowBlur = Glow;
        lightningCtx.shadowColor = "red";
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
            currentDistance,
            Iterator
          );
        }
        Glow - 0.5;
        currentThickness /= 1.1;
        currentDistance /= 1.1;
        currentTime *= 1.1;

        if (i === 99) {
          console.log(timeoutIds);
          console.log("Redraw");
          ReDraw();
        }
      }, accumulate);
      //Saves the id each iteration
      timeoutIds.push(timeoutId);
    }
  }

  function Branch(End1, End2, Thick, Branches, Distance, iteration) {
    Zeus(End1, End2, Thick, Branches, Distance, iteration);
  }

  function BranchChance(Check) {
    Check -= 1;
    if (Math.random() * Check < Chance) {
      return true;
    }
  }

  function PosNegConverter(A) {
    if (Math.random() < 0.5) {
      return A * -1;
    }
    return A;
  }

  function ReDraw() {
    if (Reset === true) {
      setReset(false);
    } else {
      setReset(true);
    }
  }

  useEffect(() => {
    if (!rainCtx) {
      return;
    }
    DrawDroplets();
  }, [rainCtx]);

  useEffect(() => {
    if (!lightningCtx) {
      return;
    }
    setTimeout(() => {
      timeoutIds = [];
      lightningCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      Zeus(
        Math.random() * window.innerWidth,
        0,
        Thickness,
        Branches,
        Distance,
        0
      );
    }, 5000);
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
