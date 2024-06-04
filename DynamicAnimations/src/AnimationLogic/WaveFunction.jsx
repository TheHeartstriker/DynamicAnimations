import { useState, useEffect, useRef } from "react";
import Blank from "../Assets/blank.png";
import Up from "../Assets/up.png";
import Down from "../Assets/down.png";
import Left from "../Assets/left.png";
import Right from "../Assets/right.png";
const Sources = [Blank, Up, Down, Left, Right];

function WaveFunction() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
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

  const Tile = [];

  const Grid = [];

  const BLANK = 0;
  const UP = 1;
  const RIGHT = 2;
  const DOWN = 3;
  const LEFT = 4;

  const Dimension = 2;

  function CreateGrid() {
    for (let i = 0; i < Dimension * Dimension; i++) {
      Grid[i] = {
        Collapsed: false,
        Options: [BLANK, UP, RIGHT, DOWN, LEFT],
      };
    }
  }

  function Load() {
    for (let i = 0; i < Sources.length; i++) {
      Tile[i] = new Image();
      Tile[i].src = Sources[i];
    }
  }

  function Draw() {
    const Width = window.innerWidth / Dimension;
    const Height = window.innerHeight / Dimension;

    for (let i = 0; i < Dimension; i++) {
      for (let j = 0; j < Dimension; j++) {
        let Cell = Grid[i * Dimension + j];
        if (Cell.Collapsed) {
          let Index = Cell.Options[0];
          ctx.drawImage(Tile[Index], i * Width, j * Height, Width, Height);
        } else {
          ctx.rect(i * Width, j * Height, Width, Height);
          ctx.strokeStyle = "blue";
          ctx.stroke();
        }
      }
    }
  }

  useEffect(() => {
    if (ctx) {
      CreateGrid();
      Load();
      Draw();
    }
  }, [ctx]);

  return (
    <canvas
      ref={canvasRef}
      id="myCanvas"
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
}
//comit change

export default WaveFunction;
