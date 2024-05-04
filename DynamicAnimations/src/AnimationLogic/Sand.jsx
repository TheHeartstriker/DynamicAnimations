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

    function Impose() {
        // Sets the number of rows and columns that are need based on res
        const rows = Math.floor(window.innerWidth / Pix_size);
        const cols = Math.floor(window.innerHeight / Pix_size);
        // Sets
        setRows(rows);
        setCols(cols);
        // Creates the grid based on the number of rows and columns
        setGrid(create2DArray(rows, cols));
    }

    // Function to create a 2D array
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

    function NextGrid(){

        let CopyGrid = [...Grid];
        for (let i = 0; i < Rows; i++){
            for (let j = 0; j < Cols; j++){
                if (CopyGrid[i][j] === 1){
                    if (CopyGrid[i][j + 1] === 0){
                        CopyGrid[i][j] = 0;
                        CopyGrid[i][j + 1] = 1;
                    }
                }
            }
        }
        setGrid(CopyGrid);
    }


    function Draw(){
        if (!ctx) return;
        Grid[5][5] = 1;
        for(let i = 0; i < Rows; i++){
            for(let j = 0; j < Cols; j++){
                if(Grid[i][j] === 1){
                    ctx.fillStyle = "blue";
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
            NextGrid();
            requestAnimationFrame(Draw);
        }
    }, [Grid]);

    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Sand;