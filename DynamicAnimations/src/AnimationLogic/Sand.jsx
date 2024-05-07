import {useState, useEffect, useRef,} from 'react';

function Sand(){
    //Grid generation
    const [Grid, setGrid] = useState([]);
    const [Rows, setRows] = useState(0);
    const [Cols, setCols] = useState(0);
    //Boilerplate code for canvas
    const [ctx, setCtx] = useState(null);
    const canvasRef = useRef(null);

    const Pix_size = 10;
    //Update to prevent depth errors
    const [Update, setUpdate] = useState(true);
    //Mouse
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    function MouseTracker(event){
        if(!ctx){
            return;
        }
        let x = Math.floor(event.clientX / Pix_size);
        let y = Math.floor(event.clientY / Pix_size);
        setMousePosition({x: x, y: y}); // update mousePosition with x and y
        if (x < Grid.length && y < Grid[0].length) { // check if x and y are within the grid
            let newGrid = [...Grid]; // create a deep copy of Grid
            newGrid[x][y] = 1;
            setGrid(newGrid);
        }
    }


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
        initialGrid[50][51] = 1;
        initialGrid[50][50] = 1; // Set the initial cell to 1
        setGrid(initialGrid);
    }


    function Draw(){
        if (!ctx || !Grid || Grid.length !== Rows || Grid[0].length !== Cols) {
            return;
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
        let NextGrid = create2DArray(Rows, Cols); //Creates a empty grid
        let updateNeeded = false;
    
        for(let i = 0; i < Rows; i++){
            let x = i * Pix_size;
            for(let j = 0; j < Cols; j++){
                let y = j * Pix_size;
                let State = Grid[i][j]; //Gets the state of the current cell or previous generation
                if(State === 1){
                    ctx.fillStyle = "blue";
                    ctx.fillRect(x, y, Pix_size, Pix_size);
    
                    let Bellow = Grid[i][j + 1];
                    if(Bellow === 0 && j < Rows - 1){
                        updateNeeded = true;
                        NextGrid[i][j] = 0;
                        NextGrid[i][j + 1] = 1;
                    }
                    else{
                        NextGrid[i][j] = 1;
                    }
                }
            }
        }
    
        setGrid(NextGrid);
        setUpdate(updateNeeded);
    }


    // Function to impose the grid
    useEffect(() => {
        Impose();
    }, [ctx]);

    useEffect(() => {
        if(Update){
            requestAnimationFrame(Draw);
        }
    }, [Grid]); 


    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} onMouseMove={MouseTracker}/>;
}

export default Sand;