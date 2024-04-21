import {useState, useEffect, useRef} from 'react';

function Rain(){
    // Create a reference to the canvas
    const canvasRef = useRef(null);
    // Create a state for the context
    const [ctx, setCtx] = useState(null);
    const [rainArray, setRainArray] = useState(new Array(40).fill().map(() => ({})));

    useEffect(() => {
        // Creates a refrence to current canvas
        const canvas = canvasRef.current;
        // Sets the default canvas size to the window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const context = canvas.getContext('2d');
        setCtx(context);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // After resizing the canvas, we need to get the context again
            setCtx(canvas.getContext('2d'));
            Droplet();
        }
        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }
    }, []);

    function Droplet(){
        ctx.beginPath();
        ctx.moveTo(20,20)
        ctx.lineTo(50, 50)
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 10;
        ctx.stroke();
    }

    if(ctx){
        Droplet();
    }







    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Rain;