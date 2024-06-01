import React, { useRef, useState, useEffect } from "react";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";

function Buttons() {
  const pageContainerRef = useRef(null);
  const [Buttoncount, setButtoncount] = useState(0); //Helps switch between animation states aka left and right not a direct counter
  const [Timer, setTimer] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleButtonClick = () => {
    //Slide left
    if (pageContainerRef.current && Buttoncount === 0 && Timer > 1.5) {
      // Remove the animation
      pageContainerRef.current.style.animation = "none";
      // Force a reflow
      pageContainerRef.current.offsetHeight; // reflow
      // Set animation
      pageContainerRef.current.style.setProperty("--start", "0%");
      pageContainerRef.current.style.setProperty("--end", "100%");
      pageContainerRef.current.style.animation = "Slide 1s linear forwards";
      setButtoncount(1);
      setTimer(0);
    }
    //Slide back aka right
    if (pageContainerRef.current && Buttoncount === 1 && Timer > 1.5) {
      // Remove the animation
      pageContainerRef.current.style.animation = "none";
      // Force a reflow
      pageContainerRef.current.offsetHeight; // reflow
      // Set animation
      pageContainerRef.current.style.setProperty("--start", "100%");
      pageContainerRef.current.style.setProperty("--end", "0%");
      pageContainerRef.current.style.animation = "Slide 1s linear forwards";
      setButtoncount(0);
      setTimer(0);
    }
  };
  // Just a test need to add configurations/presets for buttons in

  //Related code for the buttons
  const [BoolStar, setBoolStar] = useState(false);
  const [BoolRain, setBoolRain] = useState(false);
  const [BoolSand, setBoolSand] = useState(false);

  const [Config1, setConfig1] = useState(false);
  const [Config2, setConfig2] = useState(false);

  const RainData = { WIDTH: 2, HEIGHT: 20, SHEET: 3, DROPWIDTH: 0.1 };
  const LightningData = {
    startX: window.innerWidth / 2,
    startY: 0,
    Distance: 75,
    Thickness: 3,
    Time: 200,
    Branches: 1,
    Iterator: 0,
    Roughness: 100,
    Chance: 5,
    Hue: 190,
    Sat: 100,
    Light: 50,
  };

  function FirstTrue(setterFunctions) {
    for (let i = 0; i < setterFunctions.length; i++) {
      if (i === 0) {
        setterFunctions[i](true);
      } else {
        setterFunctions[i](false);
      }
    }
  }

  const Config1Check = () => {
    setBoolRain(false);
    setConfig1(true);
  };

  const Config2Check = () => {
    setConfig2(false);
  };
  const DROPS = 400;
  //Html code
  return (
    <>
      <div>
        {BoolStar && <Stars />}
        {BoolRain && <Rain DROPS={DROPS} RainProps={RainData} />}
        {BoolSand && <Sand />}
        {Config1 && (
          <Rain
            DROPS={DROPS}
            RainProps={RainData}
            LightningProps={LightningData}
          />
        )}
        {Config2 && <Rain DROPS={DROPS} RainProps={RainData} />}
      </div>
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      <div className="PageContainer" ref={pageContainerRef}>
        <div className="Buttons">
          <button
            onClick={() => FirstTrue([setBoolStar, setBoolRain, setBoolSand])}
          >
            Stars
          </button>
          <button
            onClick={() =>
              FirstTrue([setBoolRain, setBoolStar, setBoolSand, setConfig1])
            }
          >
            Rain
          </button>
          <button
            onClick={() =>
              FirstTrue([setBoolSand, setBoolRain, setBoolStar, setConfig1])
            }
          >
            Sand
          </button>
        </div>
        <div className="OptionsButtons">
          <button onClick={Config1Check}>Vibro</button>
          <button onClick={Config2Check}>Sun</button>
          <button>Test</button>
        </div>
      </div>
    </>
  );
}

export default Buttons;
