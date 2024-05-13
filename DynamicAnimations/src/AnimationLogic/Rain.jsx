import {useState, useEffect, useRef} from 'react';


function Rain(){
    // Magic numbers for the rain
    const SIZE = 20;
    const SHEET = 3;
    const DROPWIDTH = 2;
    const DROPS = 100;
    // Magic numbers for the lightning and its randomness


    // Create references to the canvases
    const rainCanvasRef = useRef(null);
    const lightningCanvasRef = useRef(null);
    // Create states for the contexts
    const [rainCtx, setRainCtx] = useState(null);
    const [lightningCtx, setLightningCtx] = useState(null);
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
        // Creates references to current canvases
        const rainCanvas = rainCanvasRef.current;
        const lightningCanvas = lightningCanvasRef.current;
        // Sets the default canvas sizes to the window size
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
        lightningCanvas.width = window.innerWidth;
        lightningCanvas.height = window.innerHeight;
        // Gets the contexts of the canvases
        const rainContext = rainCanvas.getContext('2d');
        const lightningContext = lightningCanvas.getContext('2d');
        // Sets the contexts to the states
        setRainCtx(rainContext);
        setLightningCtx(lightningContext);
        // Function to resize the canvas
        const resizeCanvas = () => {
            // The resize
            rainCanvas.width = window.innerWidth;
            rainCanvas.height = window.innerHeight;
            lightningCanvas.width = window.innerWidth;
            lightningCanvas.height = window.innerHeight;
            // After resizing the canvas, we need to get the context again
            setRainCtx(rainCanvas.getContext('2d'));
            setLightningCtx(lightningCanvas.getContext('2d'));
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
        rainCtx.beginPath();
        rainCtx.moveTo(x1,y1);
        rainCtx.lineTo(x2,y2);
        rainCtx.strokeStyle = "blue";
        rainCtx.lineWidth = DROPWIDTH;
        rainCtx.stroke();
    }

    // Animation function so rules etc can be applied
    function DrawDroplets(){
        rainCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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

    const [Distance, setDistance] = useState(50);
    const [Thickness, setThickness] = useState(3.5);
    const [Time, setTime] = useState(200); // Used to create a delay between each lightning bolt in tandem with totalDelay
    const [Branches, setBranches] = useState(0); 
    const [Reset, setReset] = useState(true); // Used to reset the lightning bolt
    
    function Zeus(startX, startY){
        if(!lightningCtx){
            return;
        }
        lightningCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        //Refrences
        let currentThickness = Thickness;
        let currentDistance = Distance;
        let currentTime = Time;
        //Stores the total delay as it increases
        let totalDelay = 0;
    
        for(let i = 0; i < 100; i++){
            totalDelay += currentTime; // Creates a steadily increasing delay
            setTimeout(() => {
                lightningCtx.beginPath();
                lightningCtx.strokeStyle = "purple";
                lightningCtx.lineWidth = currentThickness;
                lightningCtx.moveTo(startX,startY);
                let endX = startX + PosNegConverter(currentDistance);
                let endY = startY + Math.random() * currentDistance * 2;
                lightningCtx.lineTo(endX, endY);
                startX = endX;
                startY = endY;
                lightningCtx.stroke();
    
                currentThickness /= 1.1;
                currentDistance /= 1.1;
                currentTime *= 1.5; // Suport steadly increasing delay

            }, totalDelay);
        }
    
        let totalDelay2 = totalDelay + currentTime * 10; //Magic number
    
        setTimeout(() => {
            setReset(true);
            console.log("True");
        }, totalDelay2); // Set Reset to true after total delay
    
        setThickness(currentThickness);
        setDistance(currentDistance);
        setTime(currentTime);
    }
    
    // This is a helper function it helps with randomizing the lightning
    function PosNegConverter(A){
        if(Math.random() < 0.5){
            return A * -1;
        }
        return A;
    
    }

    useEffect(() => {
        if(!rainCtx){
            return
        }
        DrawDroplets();
    }, [rainCtx]);

    useEffect(() => {
        if(!lightningCtx){
            return
        }
        if (Reset){
            console.log("Calling zeus")
            setReset(false);
            Zeus(Math.random() * window.innerWidth, 0);
        }
    }, [lightningCtx, Reset]);

    return <div>
    <canvas ref={rainCanvasRef} style={{position: 'absolute'}} id="rainCanvas" width={window.innerWidth} height={window.innerHeight} />
    <canvas ref={lightningCanvasRef} style={{position: 'absolute'}} id="lightningCanvas" width={window.innerWidth} height={window.innerHeight} />
    </div>
    ;
}

export default Rain;