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
  // Create references to the canvases
  const rainCanvasRef = useRef(null);
  const lightningCanvasRef = useRef(null);
  // Create states for the contexts
  const [rainCtx, setRainCtx] = useState(null);
  const [lightningCtx, setLightningCtx] = useState(null);
  // The rain array
  const [rainArray, setRainArray] = useState(
    new Array(RainProps.DROPS).fill().map(() => ({
      Start: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: 0,
      },
      speed: Math.random() * 5 + 5,
      width: RainProps.WIDTH,
      height: RainProps.HEIGHT / (Math.floor(Math.random() * 3) + 1),
    }))
  );
  //Call a reset on lightning
  const [Reset, setReset] = useState(false);
  // Create a reference to the animation frame for the rain
  const animationFrameId = useRef(null);

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
    let gradient = rainCtx.createLinearGradient(
      x1,
      y1,
      x1 + width,
      y1 + height
    );
    if (!gradient) {
      return;
    }
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "blue");
    rainCtx.beginPath();
    rainCtx.rect(x1, y1, width, height);
    rainCtx.lineWidth = RainProps.DROPWIDTH;
    rainCtx.strokeStyle = "";
    rainCtx.fillStyle = gradient;
    rainCtx.fill();
    rainCtx.stroke();
  }

  function DrawDroplets() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    rainCtx.clearRect(0, 0, width, height);

    const newRainArray = rainArray.map((drop) => {
      drop.Start.y += drop.speed;

      Droplet(drop.Start.x, drop.Start.y, drop.width, drop.height);

      if (drop.Start.y > height) {
        drop.Start.x = Math.floor(Math.random() * width);
        drop.Start.y = 0;
      }

      return drop;
    });

    setRainArray(newRainArray);
    animationFrameId.current = requestAnimationFrame(DrawDroplets);
  }
  const [Ids, setIds] = useState([]);

  function Zeus(startX, startY, Thickness, Branches, Distance) {
    // Creates local references to the variables
    let Check = Roughness;
    let currentDistance = Distance;
    let currentThickness = Thickness;
    let currentTime = Math.floor(Math.random() * Time) + 50;
    let accumulate = 0;
    let currentBranches = Branches;
    let Glow = 20;

    for (let i = 0; i < Roughness; i++) {
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
            currentDistance
          );
        }
        Glow - 0.5;
        currentThickness /= 1.1;
        currentDistance /= 1.1;
        currentTime *= 1.1;

        if (i === Roughness - 1) {
          console.log("Redraw");
          ReDraw();
        }
      }, accumulate);
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
  function BranchChance(Check) {
    Check -= 1;
    if (Math.random() * Check < Chance) {
      return true;
    }
  }
  //Function to convert a positive or negative value
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
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [rainCtx]);

  let test = document.getElementById("lightningCanvas");
  useEffect(() => {
    if (!lightningCtx) {
      return;
    }

    test.style.animation = "none";
    void test.offsetHeight;
    if (test) {
      test.style.animation = "Flash";
      test.style.animationDuration = "1s";
    }
    //Calls lightning and the length time wise of the lightning

    lightningCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    clearAllTimeouts();
    Zeus(
      100 + Math.random() * window.innerWidth - 200,
      0,
      Thickness,
      Branches,
      Distance
    );
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
