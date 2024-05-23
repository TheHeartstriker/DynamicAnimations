import {useState, useEffect, useRef} from 'react';
//Need to optimize code
//Need to fix the color change
//Orginize and understand the code aka comments
function Sand(){
    //Grid generation
    const [Grid, setGrid] = useState([]);
    const [Rows, setRows] = useState(0);
    const [Cols, setCols] = useState(0);
    //Boilerplate code for canvas
    const [ctx, setCtx] = useState(null);
    const canvasRef = useRef(null);
    //On state which purpose is mainly to check if a pixel is on screen
    const [On, setOn] = useState(false);
    //Color state
    const [Color, setColor] = useState(190);
    //Pixel size
    const Pix_size = 5;
    //Update to prevent depth errors


    useEffect(() => {
        // Creates a refrence to current canvas
        const canvas = canvasRef.current;
        // Sets the default canvas size to the window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Gets the context of the canvas
        const context = canvas.getContext('2d');
        // Sets the context to the state
        setCtx(context);
        // Function to resize the canvas
        const resizeCanvas = () => {
            // The resize
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // After resizing the canvas, we need to get the context again
            setCtx(canvas.getContext('2d'));
            // Where the redrawing of the canvas happens
    
        }
        // Event listener where the resizeCanvas function is called
        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }
    }, []);

    function ChangeColor(){
        let newColorH = Color + 0.5;
        if(newColorH > 260 || newColorH === 0){
            newColorH = 190;
        }
        setColor(newColorH);
    }

    //Mouse down event
    const [MouseDown, setMouseDown] = useState(false); 
    const handleMouseDown = () => {
        setOn(true);
        setMouseDown(true);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseUp = () => {
        setMouseDown(false);
        window.removeEventListener('mouseup', handleMouseUp);
    }
    //Tracks the mouse position converts it to grid position and sets the grid to 1
    function MouseTracker(event){
        if(!ctx || MouseDown === false){
            return;
        }
        let x = Math.floor(event.clientX / Pix_size);
        let y = Math.floor(event.clientY / Pix_size);
        let AmountAround = 10;
        let Extent = Math.floor(AmountAround / 2);
        let newGrid = [...Grid]; // create a copy of Grid
        for(let i = -Extent; i <= Extent; i++){
            for(let j = -Extent; j <= Extent; j++){
                if(Math.random() < 0.5){
                let X = x + i;
                let Y = y + j;
                if(X >= 0 && X < Rows && Y >= 0 && Y < Cols){
                    newGrid[X][Y] = Color; // modify the copy, not the original state
                }
            }}
        }
        setGrid(newGrid); // update the state with the modified copy
    }
    

    // Function to create a 2D array and set all values to 0
    function create2DArray(Rows, Cols){
        let arr = new Array(Rows);
        for(let i = 0; i < arr.length; i++){
            arr[i] = new Array(Cols);
            for(let j = 0; j < arr[i].length; j++){
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    //Defines the number of rows and columns based on the window size
    function Impose() {
        // Sets the number of rows and columns that are need based on res
        const rows = Math.floor(window.innerWidth / Pix_size);
        const cols = Math.floor(window.innerHeight / Pix_size);
        // Sets
        setRows(rows);
        setCols(cols);
    
        // Creates the grid based on the number of rows and columns
        let initialGrid = create2DArray(rows, cols);

        setGrid(initialGrid);
    }


    function Draw(){
        if (!ctx || !Grid || Grid.length !== Rows || Grid[0].length !== Cols) {
            return;
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "black";
    
        let NextGrid = create2DArray(Rows, Cols); //Creates a empty grid

    
        for(let i = 0; i < Rows; i++){
            let x = i * Pix_size;
            for(let j = 0; j < Cols; j++){
                let y = j * Pix_size;
                let State = Grid[i][j]; //Gets the state of the current cell or previous generation
                if(State > 0){
                    ctx.fillStyle = ctx.fillStyle = `hsl(${Grid[i][j]}, 100%, 50%)`;
                    ctx.fillRect(x, y, Pix_size, Pix_size);
    
                    let cellBellow = Grid[i][j + 1]; // renamed variable
                    let cellRight = (i + 1 < Rows) ? Grid[i + 1][j + 1] : 1;
                    let cellLeft = (i - 1 >= 0) ? Grid[i - 1][j + 1] : 1;
                    if (cellBellow === 0){
                    Bellow(NextGrid, i, j, State, );
                    }
                    else if(cellRight === 0){
                        BellowRight(NextGrid, i, j, State, );
                    }
                    else if(cellLeft === 0){
                        BellowLeft(NextGrid, i, j, State, );
                    }
                    else{
                        NextGrid[i][j] = State;
                    }
                }
            }
        }
    
        setGrid(NextGrid);

    }

    function Bellow(NextGrid, i, j, State, ){

            NextGrid[i][j] = 0;
            NextGrid[i][j + 1] = State;

}
    function BellowRight(NextGrid, i, j, State, ){

        NextGrid[i][j] = 0;
        NextGrid[i + 1][j + 1] = State;

    }
    function BellowLeft(NextGrid, i, j, State, ){
        NextGrid[i][j] = 0;
        NextGrid[i - 1][j + 1] = State;

    }


    // Function to impose the grid
    useEffect(() => {
        Impose();
    }, [ctx]);

    useEffect(() => {
        if(On){
            ChangeColor();
            requestAnimationFrame(Draw);

        }
    }, [Grid]); 


    return <canvas
        ref={canvasRef} id="myCanvas" 
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={MouseTracker}>
    </canvas>;
}

export default Sand;