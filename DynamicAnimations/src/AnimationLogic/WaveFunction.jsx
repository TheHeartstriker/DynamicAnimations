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

  //Loads the images into the Tile array
  const Tile = [];
  function Load() {
    for (let i = 0; i < Sources.length; i++) {
      Tile[i] = new Image();
      Tile[i].src = Sources[i];
    }
  }

  //Creates the grid and gives them states
  const Grid = [];

  const Dimension = 2;
  const BLANK = 0;
  const UP = 1;
  const RIGHT = 2;
  const DOWN = 3;
  const LEFT = 4;
  function CreateGrid() {
    for (let i = 0; i < Dimension * Dimension; i++) {
      Grid[i] = {
        Collapsed: false,
        Options: [BLANK, UP, RIGHT, DOWN, LEFT],
      };
    }
  }

  const Rules = {
    BLANK: [
      [BLANK, UP],
      [BLANK, RIGHT],
      [BLANK, DOWN],
      [BLANK, LEFT],
    ], //Above //Right //Below //Left
    UP: [
      [RIGHT, LEFT, DOWN], //Above
      [LEFT, UP, DOWN], //Right
      [BLANK, DOWN], //Below
      [RIGHT, UP, DOWN], //Left
    ],
    RIGHT: [
      [RIGHT, LEFT, DOWN], //Above
      [LEFT, UP, DOWN], //Right
      [RIGHT, LEFT, UP], //Below
      [BLANK, LEFT], //Left
    ],
    DOWN: [
      [BLANK, UP], //Above
      [LEFT, UP, DOWN], //Right
      [RIGHT, LEFT, UP], //Below
      [RIGHT, UP, DOWN], //Left
    ],
    LEFT: [
      [RIGHT, LEFT, DOWN], //Above
      [BLANK, RIGHT], //Right
      [RIGHT, LEFT, UP], //Below
      [UP, DOWN, RIGHT],
    ],
  };

  function Collapser(Grid) {
    //Creates a shallow copy of the grid
    const Shallow = [...Grid];
    //Sorts the grid by the length of the options
    Shallow.sort((a, b) => {
      return a.Options.length - b.Options.length;
    });
    //Store possible options of the first cell
    let Len = Shallow[0].Options.Length;
    //Find the index of the first cell with more options than the first cell
    let StopIndex = 0;
    for (let i = 1; i < Shallow.length; i++) {
      if (Shallow[i].Options.length > Len) {
        StopIndex = i;
        break;
      }
    }
    //Remove all cells with less options than the first cell
    if (StopIndex > 0) Shallow.splice(StopIndex);

    const CellIndex = Math.floor(Math.random() * Shallow.length);
    Shallow[CellIndex].Collapsed = true;
    const Pick = Math.floor(Math.random() * Shallow[CellIndex].Options.length);
    Shallow[CellIndex].Options = [Pick];
  }

  function Draw() {
    Collapser(Grid);

    const Width = window.innerWidth / Dimension; //Cell width
    const Height = window.innerHeight / Dimension; //Cell height

    //Row
    for (let i = 0; i < Dimension; i++) {
      //Column
      for (let j = 0; j < Dimension; j++) {
        let Cell = Grid[i * Dimension + j]; //Find index
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
    const NextGenTile = [];
    for (let j = 0; j < Dimension; j++) {
      for (let i = 0; i < Dimension; i++) {
        let Index = i + j * Dimension;
        if (Grid[Index].Collapsed) {
          NextGenTile[Index] = Grid[Index];
        } else {
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
