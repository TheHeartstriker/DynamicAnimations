import {useState, useEffect, useRef} from 'react';


function Rain(){
    // Magic numbers
    const SIZE = 20;
    const SHEET = 3;
    const DROPWIDTH = 2;
    const DROPS = 100;

    const [StartEnd, setStartEnd] = useState([]);
    const [lightning, setLightning] = useState([]);
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

    function CreateLightning(Points){
        ctx.beginPath();
        ctx.moveTo(Points[0].x, Points[0].y);
        for(let i = 0; i < lightning.length; i++){
            if (lightning[i]) { // Check if the current element is defined
                ctx.lineTo(lightning[i].x, lightning[i].y);
            }
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        requestAnimationFrame(() => CreateLightning(Points)); // Pass Points to CreateLightning
    }

    function SetPoints(){
        //First point of the bolt
        let x = Math.random() * window.innerWidth;
        let y = 0;
        //Second point of the bolt
        let x2 = Math.random() * window.innerWidth;
        let y2 = Math.random() * window.innerHeight;
        let newPoints = [{x: x, y: y}, {x: x2, y: y2}];
        setStartEnd(newPoints);
        return newPoints;
    }

    function Bolt(Points){
        let newLightning = [];
        let Ranx = Math.random() * window.innerWidth;
        let start = Points[0];
        let end = Points[1];
        let midPointx = (start.x + end.x) / 2;
        let midPointy = (start.y + end.y) / 2;

    
        // Add the start point to the newLightning array
        newLightning.push(start);
    
        for(let i = 0; i < 1000; i++){
            let NewMidPoint = {x: midPointx + Ranx, y: midPointy};
            Ranx -= 100;
            newLightning.push(NewMidPoint);
            midPointx = (midPointx + NewMidPoint.x) / 2;
            midPointy = (midPointy + NewMidPoint.y) / 2;
        }
    
        // Add the end point to the newLightning array
        newLightning.push(end);
    
        // Update the state
        setLightning(newLightning);
    }
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


    useEffect(() => {
        if (ctx){
            let Points = SetPoints();
            Bolt(Points);
            CreateLightning(Points);
        }
    }, [ctx]);


    return <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} />;
}

export default Rain;