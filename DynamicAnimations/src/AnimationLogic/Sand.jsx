import {useState, useEffect, useRef} from 'react';

function Sand(){
    useEffect(() => {
        const w = 10;
        const [ctx, setCtx] = useState(null);
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

    function CanvasArray(){
        
    }

    function create2DArray(rows, columns){
        let arr = new Array(rows);
        for(let i = 0; i < rows; i++){
            arr[i] = new Array(columns);
        }
        return arr;
    }
}