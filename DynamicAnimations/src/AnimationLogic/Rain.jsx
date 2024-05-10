import {useState, useEffect, useRef} from 'react';


function Rain(){
    // Magic numbers for the rain
    const SIZE = 20;
    const SHEET = 3;
    const DROPWIDTH = 2;
    const DROPS = 100;
    // Magic numbers for the lightning and its randomness


    // Create a reference to the canvas
    const canvasRef = useRef(null);
    // Create a state for the context
    const [ctx, setCtx] = useState(null);
    // The rain array
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
    function DrawDroplets(){
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const newRainArray = rainArray.map((drop) => {
            const newDrop = {...drop};
            newDrop.Start.y += newDrop.speed;
            Droplet(newDrop.Start.x, newDrop.Start.y, newDrop.Start.x, newDrop.Start.y + newDrop.size);
            if (newDrop.Start.y > window.innerHeight){
                newDrop.Start.x = Math.floor(Math.random() * window.innerWidth);
                newDrop.Start.y = 0;
            }
            return newDrop;
        });
        setRainArray(newRainArray);
    
        requestAnimationFrame(DrawDroplets);
    }

    const [Distance, setDistance] = useState(40);

    function Zeus(startX, startY){
        for(let i = 0; i < 1000; i++){
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.moveTo(startX,startY)

            setDistance(Distance / 1.1)
            let endX = startX + PosNegConverter(Distance);
            let endY = startY + Math.random() * Distance * 2;
            ctx.lineTo(endX, endY);
            startX = endX;
            startY = endY;
            ctx.stroke();
        }
    }

    function PosNegConverter(A){
        if(Math.random() < 0.5){
            return A * -1;
        }
        return A;
    
    }

    useEffect(() => {
        if (ctx){
            Zeus(Math.random() * window.innerWidth, 0);

        }
    }, [ctx]);


    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Rain;