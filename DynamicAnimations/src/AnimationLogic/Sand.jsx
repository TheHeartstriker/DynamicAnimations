import {useState, useEffect, useRef} from 'react';

function Sand(){
    const SIZE = 20;
    const [Grid, setGrid] = useState([]);
    const [Rows, setRows] = useState(0);
    const [Cols, setCols] = useState(0);
    const [ctx, setCtx] = useState(null);
    const canvasRef = useRef(null);
    const Pix_size = 10;
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
        initialGrid[5][5] = 1; // Set the initial cell to 1
        setGrid(initialGrid);
    }

    // Creates the next generation of the grid
    function NextGrid(){

        let NextGrid = create2DArray(Rows, Cols); //Creates a empty grid
        for(let i = 0; i < Rows; i++){
            for(let j = 0; j < Cols; j++){
                let State = Grid[i][j]; //Gets the state of the current cell or previous generation
                if(State === 1){
                    let Bellow = Grid[i][j + 1];
                    if(Bellow === 0){
                        NextGrid[i][j] = 0;
                        NextGrid[i][j + 1] = 1;
                    }
                }
            }
        }
        setGrid(NextGrid);
    }

    // Function to draw based on the values in the grid
    function Draw(){
        if (!ctx) return;
        for(let i = 0; i < Rows; i++){
            for(let j = 0; j < Cols; j++){
                if(Grid[i][j] === 1){
                    ctx.fillStyle = "blue";
                    ctx.fillRect(i * Pix_size, j * Pix_size, Pix_size, Pix_size);
                }
                if(Grid[i][j] === 0){
                    ctx.fillStyle = "white";
                    ctx.fillRect(i * Pix_size, j * Pix_size, Pix_size, Pix_size);
                }
                

            }
        }
        requestAnimationFrame(Draw);
    }

    useEffect(() => {
        if (ctx){
            Impose();
        }
    }, [ctx]);
    
    useEffect(() => {
        if (Grid.length > 0){
            Draw();
            NextGrid();
        }
    }, []);

    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Sand;