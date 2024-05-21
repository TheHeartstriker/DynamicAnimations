import React, { useRef, useState, useEffect } from 'react';

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
    if (pageContainerRef.current && Buttoncount === 0 && Timer > 2) {
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
    if (pageContainerRef.current && Buttoncount === 1 && Timer > 2) {
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

  //Html code
  return (
    <>
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      <div className="PageContainer" ref={pageContainerRef}>
        <div className="Buttons">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
        </div>
      </div>
    </>
  );
}

export default Buttons;