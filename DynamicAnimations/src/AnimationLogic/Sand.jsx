import { useState, useEffect, useRef } from "react";
//Need to fix the color change
function Sand({ SandProps }) {
  let { Reset, StartHsl, EndHsl, Speed } = SandProps;
  //Grid generation
  const [Grid, setGrid] = useState([]);
  const [Rows, setRows] = useState(0);
  const [Cols, setCols] = useState(0);
  //Boilerplate code for canvas
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  //On state which purpose is mainly to check if a pixel is on screen
  const [On, setOn] = useState(false);
  //Color state value expects to be a number in hsl
  const [Color, setColor] = useState(0);
  //Pixel size
  const Pix_size = 10;
  //Mouse down event
  const [MouseDown, setMouseDown] = useState(false);
  //Initial setup
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
      //Recalculates the rows and columns
      Impose();
    };
    // Event listener where the resizeCanvas function is called
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  //Advance and change color back to the initial color if needed
  function ChangeColor() {
    let newColorH = Color + Speed;
    if (newColorH > EndHsl || newColorH === 0) {
      newColorH = StartHsl;
    }
    setColor(newColorH);
  }
  //Event listeners for mouse down and up
  const handleMouseDown = () => {
    setOn(true);
    setMouseDown(true);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  //Tracks the mouse position converts it to grid position and sets the grid to 1
  function MouseTracker(event) {
    if (!ctx || MouseDown === false) {
      return;
    }
    //Converts x and y to grid locations
    let x = Math.floor(event.clientX / Pix_size);
    let y = Math.floor(event.clientY / Pix_size);

    let AmountAround = 10;
    let Extent = Math.floor(AmountAround / 2);
    let newGrid = [...Grid];
    for (let i = -Extent; i <= Extent; i++) {
      for (let j = -Extent; j <= Extent; j++) {
        if (Math.random() < 0.5) {
          let X = x + i;
          let Y = y + j;
          if (X >= 0 && X < Rows && Y >= 0 && Y < Cols) {
            //Color check needed to check first frame
            if (Color && Color >= StartHsl && Color <= EndHsl) {
              newGrid[X][Y] = Color;
            }
          }
        }
      }
    }
    setGrid(newGrid);
  }

  // Creates a 2D array with values of 0
  function create2DArray(Rows, Cols) {
    let arr = new Array(Rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(Cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }

  //Defines the number of rows and columns based on the window size
  function Impose() {
    resetSand();
    const rows = Math.floor(window.innerWidth / Pix_size);
    const cols = Math.floor(window.innerHeight / Pix_size);
    setRows(rows);
    setCols(cols);
    // Creates the grid based on the number of rows and columns
    let initialGrid = create2DArray(rows, cols);
    setGrid(initialGrid);
  }

  function Draw() {
    if (!ctx || !Grid || Grid.length !== Rows || Grid[0].length !== Cols) {
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    //Creates the next grid
    let NextGrid = create2DArray(Rows, Cols);
    //Instructions for the next grid
    for (let i = 0; i < Rows; i++) {
      for (let j = 0; j < Cols; j++) {
        //Previous grid gen state
        let State = Grid[i][j];
        //Instructions for the next grid
        if (State > 0) {
          //Creates the slow or sticky falling look
          let FallVar = Math.random();

          let x = i * Pix_size;
          let y = j * Pix_size;
          ctx.fillStyle = ctx.fillStyle = `hsl(${Grid[i][j]}, 100%, 50%)`;
          ctx.fillRect(x, y, Pix_size, Pix_size);
          //Fall logic
          let cellBellow = Grid[i][j + 1];
          let cellRight = i + 1 < Rows ? Grid[i + 1][j + 1] : 1;
          let cellLeft = i - 1 >= 0 ? Grid[i - 1][j + 1] : 1;
          if (cellBellow === 0) {
            Bellow(NextGrid, i, j, State);
          } else if (cellRight === 0 && FallVar < 0.5) {
            BellowRight(NextGrid, i, j, State);
          } else if (cellLeft === 0 && FallVar > 0.5) {
            BellowLeft(NextGrid, i, j, State);
          } else {
            NextGrid[i][j] = State;
          }
        }
      }
    }

    setGrid(NextGrid);
  }
  //Functions for the falling logic
  function Bellow(NextGrid, i, j, State) {
    NextGrid[i][j] = 0;
    NextGrid[i][j + 1] = State;
  }
  function BellowRight(NextGrid, i, j, State) {
    NextGrid[i][j] = 0;
    NextGrid[i + 1][j + 1] = State;
  }
  function BellowLeft(NextGrid, i, j, State) {
    NextGrid[i][j] = 0;
    NextGrid[i - 1][j + 1] = State;
  }
  //Used to reset the sand
  function resetSand() {
    setGrid([]);
    setOn(false);
    setMouseDown(false); // Reset the MouseDown state
    setColor(190); // Reset the color to the initial value
  }
  // Function to impose the grid and reset the sand
  useEffect(() => {
    Impose();
  }, [ctx, Reset]);
  //Main loop
  useEffect(() => {
    if (On) {
      ChangeColor();
      requestAnimationFrame(Draw);
    }
  }, [Grid, Reset]);

  return (
    <canvas
      ref={canvasRef}
      id="myCanvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={MouseTracker}
    ></canvas>
  );
}

export default Sand;
