import {useState, useEffect, useRef} from 'react';


function Rain(){
    const SIZE = 20;
    const SHEET = 3;
    const DROPWIDTH = 2;
    const DROPS = 100;
    // Create a reference to the canvas
    const canvasRef = useRef(null);
    // Create a state for the context
    const [ctx, setCtx] = useState(null);
    const [rainArray, setRainArray] = useState(new Array(DROPS).fill().map(() => ({
        Start: {
            x: Math.floor(Math.random() * window.innerWidth),
            y: 0,
        },
        speed: Math.random() * 5 + 5,
        size: SIZE / (Math.floor(Math.random() * SHEET) + 1),
    })));

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
    // Drop constructor
    function Droplet(x1, y1, x2, y2){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = DROPWIDTH;
        ctx.stroke();
    }
    // Animation function so rules etc can be applied
    function DrawAnimation(){
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const newRainArray = [...rainArray];
        newRainArray.forEach((drop) => {
            drop.Start.y += drop.speed;
            Droplet(drop.Start.x, drop.Start.y, drop.Start.x, drop.Start.y + drop.size);
            if (drop.Start.y > window.innerHeight){
                drop.Start.x = Math.floor(Math.random() * window.innerWidth);
                drop.Start.y = 0;
            }
        });
        setRainArray(newRainArray);

        requestAnimationFrame(DrawAnimation);
    }

    useEffect(() => {
        if (ctx){
            DrawAnimation();
        }
    }, [ctx]);






    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Rain;