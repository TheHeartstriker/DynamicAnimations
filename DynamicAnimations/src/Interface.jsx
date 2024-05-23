import React, { useRef, useState, useEffect } from 'react';
import Stars from './AnimationLogic/Stars.jsx';
import Rain from './AnimationLogic/Rain.jsx';
import Sand from './AnimationLogic/Sand.jsx';

function Buttons() {
  const pageContainerRef = useRef(null);
  const [Buttoncount, setButtoncount] = useState(0); //Helps switch between animation states aka left and right not a direct counter
  const [Timer, setTimer] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleButtonClick = () => {
    //Slide left
    if (pageContainerRef.current && Buttoncount === 0 && Timer > 1.5) {
      // Remove the animation
      pageContainerRef.current.style.animation = 'none';
      // Force a reflow
      pageContainerRef.current.offsetHeight; // reflow
      // Set animation
      pageContainerRef.current.style.setProperty('--start', '0%');
      pageContainerRef.current.style.setProperty('--end', '100%');
      pageContainerRef.current.style.animation = 'Slide 1s linear forwards';
      setButtoncount(1);
      setTimer(0)

    }
    //Slide back aka right
    if (pageContainerRef.current && Buttoncount === 1 && Timer > 1.5) {
      // Remove the animation
      pageContainerRef.current.style.animation = 'none';
      // Force a reflow
      pageContainerRef.current.offsetHeight; // reflow
      // Set animation
      pageContainerRef.current.style.setProperty('--start', '100%');
      pageContainerRef.current.style.setProperty('--end', '0%');
      pageContainerRef.current.style.animation = 'Slide 1s linear forwards';
      setButtoncount(0);
      setTimer(0)


    }
  };

  //Related code for the buttons
const [BoolStar, setBoolStar] = useState(false);
const [BoolRain, setBoolRain] = useState(false);
const [BoolSand, setBoolSand] = useState(false);

function Test(setterFunctions) {
  for (let i = 0; i < setterFunctions.length; i++) {
    if (i === 0) {
      setterFunctions[i](true);
    } else {
      setterFunctions[i](false);
    }
  }
}
  //Html code
  return (
    <>
      <div>
        {BoolStar && <Stars />}
        {BoolRain && <Rain />}
        {BoolSand && <Sand />}
      </div>
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      <div className="PageContainer" ref={pageContainerRef}>
        <div className="Buttons">
          <button onClick={() => Test([setBoolRain, setBoolSand, setBoolStar])}>1</button>
          <button onClick={() => Test([setBoolSand, setBoolRain, setBoolStar])}>2</button>
          <button onClick={() => Test([setBoolStar, setBoolSand, setBoolRain])}>3</button>
          <button>4</button>
        </div>
      </div>
    </>
  );
}


export default Buttons;