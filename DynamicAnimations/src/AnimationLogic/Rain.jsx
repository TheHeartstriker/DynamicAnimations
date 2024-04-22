import {useState, useEffect, useRef} from 'react';

function Rain(){
    // Create a reference to the canvas
    const canvasRef = useRef(null);
    // Create a state for the context
    const [ctx, setCtx] = useState(null);
    const [rainArray, setRainArray] = useState(new Array(40).fill().map(() => ({
        Start: {
            x: Math.floor(Math.random() * window.innerWidth),
            y: 0,
        }
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

    function Droplet(x1, y1, x2, y2){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }

    function DrawAnimation(){
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        let newRainArray = [...rainArray];
        newRainArray.forEach((drop) => {
            drop.Start.y += 5;
            Droplet(drop.Start.x, drop.Start.y, drop.Start.x, drop.Start.y + 10);
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