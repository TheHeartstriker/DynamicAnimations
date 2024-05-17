import {useState, useEffect, useRef} from 'react';


function Rain(){
    // Magic numbers for the rain
    const WIDTH = 2.5;
    const HEIGHT = 20;
    const SHEET = 3;
    const DROPWIDTH = 0.5;
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
        width: WIDTH,
        height: HEIGHT / Math.floor(Math.random() * SHEET),
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
    function Droplet(x1, y1, width, height){
        rainCtx.beginPath();
        rainCtx.rect(x1, y1, width, height);
        rainCtx.lineWidth = DROPWIDTH;
        rainCtx.strokeStyle = "gray";
        rainCtx.fillStyle = "blue";
        rainCtx.fill();
        rainCtx.stroke();
    }

    // Animation function so rules etc can be applied
    function DrawDroplets(){
        rainCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const newRainArray = rainArray.map((drop) => {
            const newDrop = {...drop};
            newDrop.Start.y += newDrop.speed;

            Droplet(newDrop.Start.x, newDrop.Start.y, newDrop.width, newDrop.height);
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
    const [Depth, setDepth] = useState(3);
    const [Time, setTime] = useState(200); // Used to create a delay between each lightning bolt in tandem with totalDelay
    const [Reset, setReset] = useState(true); // Used to reset the lightning bolt
    
    function Zeus(startX, startY, Depth, Thickness, Distance){
        if(!lightningCtx ||  Depth <= 0){
            return;
        }
        //Refrences
        let currentDepth = Depth;
        let currentThickness = Thickness;
        let currentDistance = Distance;
        let currentTime = Time;
        //Stores the total delay as it increases
        let totalDelay = 0;
    
        for(let i = 0; i < 100; i++){
            totalDelay += currentTime; // Creates a steadily increasing delay
            setTimeout(() => {
                lightningCtx.beginPath();
                lightningCtx.strokeStyle = "blue";
                lightningCtx.lineWidth = currentThickness;
                lightningCtx.moveTo(startX,startY);
                let endX = startX + PosNegConverter(currentDistance);
                let endY = startY + Math.random() * currentDistance * 2;
                lightningCtx.lineTo(endX, endY);
                startX = endX;
                startY = endY;
                lightningCtx.stroke();

                if (i % 10 === 0 && currentDepth > 0){
                    let branchX = endX;
                    let branchY = endY;
                    currentDepth -= 1;
                    Zeus(branchX, branchY, currentDepth, currentThickness, currentDistance);
                }

                currentThickness /= 1.1;
                currentDistance /= 1.1;
                currentTime *= 1.3; //Increases time 

                

            }, totalDelay);

        }
        let totalDelay2 = totalDelay + currentTime * 2; //Magic number
        setTimeout(() => {
            resetValues();
            if (Reset === false){
                setReset(true);
            }
            else{
                setReset(false);
            }
        }, totalDelay2); // Set Reset to true after total delay
    
        setThickness(currentThickness);
        setDistance(currentDistance);
        setTime(currentTime);
        setDepth(currentDepth);
    }
    
    // This is a helper function it helps with randomizing the lightning
    function PosNegConverter(A){
        if(Math.random() < 0.5){
            return A * -1;
        }
        return A;
    
    }

    function resetValues() {
        setDistance(50);
        setThickness(3.5);
        setDepth(3);
        setTime(200);
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
        lightningCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        console.log(Thickness);
        Zeus(Math.random() * window.innerWidth, 0, Depth, Thickness, Distance);

    }, [lightningCtx, Reset]);

    return <div>
    <canvas ref={rainCanvasRef} style={{position: 'absolute'}} id="rainCanvas" width={window.innerWidth} height={window.innerHeight} />
    <canvas ref={lightningCanvasRef} style={{position: 'absolute'}} id="lightningCanvas" width={window.innerWidth} height={window.innerHeight} />
    </div>
    ;
}

export default Rain;