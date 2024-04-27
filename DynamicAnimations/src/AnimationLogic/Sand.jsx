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

    useEffect(() => {
        // Sets the number of rows and columns that are need based on res
        const rows = Math.floor(window.innerWidth / Pix_size);
        const cols = Math.floor(window.innerHeight / Pix_size);
        // Sets
        setRows(rows);
        setCols(cols);
        // Creates the grid based on the number of rows and columns
        setGrid(create2DArray(rows, cols));
    }, []);

    // Function to create a 2D array
    function create2DArray(Rows, Cols){
        let arr = new Array(Rows);
        for(let i = 0; i < arr.length; i++){
            arr[i] = new Array(Cols);
        }
        return arr;
    }

    //Sets the values of the grid to 0
    function Impose(){
        for(let i = 0; i < Rows; i++){
            for(let j = 0; j < Cols; j++){
                Grid[i][j] = 0;
            }
        }
    }

    function Draw(){
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for(let i = 0; i < Rows; i++){
            for(let j = 0; j < Cols; j++){
                if(Grid[i][j] === 1){
                    ctx.fillStyle = "blue";
                    ctx.fillRect(i * Pix_size, j * Pix_size, Pix_size, Pix_size);
                }
            }
        }
    }
    useEffect(() => {
        if (ctx){
            Impose();
            Draw();
        }
    }, [ctx]);

    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Sand;