import React, { useRef, useState, useEffect } from "react";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";
import WaveFunction from "../AnimationLogic/WaveFunction.jsx";

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
    if (pageContainerRef.current && Buttoncount === 0 && Timer > 1.2) {
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
  const [RainIsON, setRainIsON] = useState(false);
  //Activate animation/preset
  const [BoolStar, setBoolStar] = useState(false);
  const [BoolSand, setBoolSand] = useState(false);
  const [BoolRain, setBoolRain] = useState(false);
  const [BoolWave, setBoolWave] = useState(false);

  const [Config1, setConfig1] = useState(false);
  const [Config2, setConfig2] = useState(false);

  const AniStates = [
    setBoolStar,
    setBoolSand,
    setBoolRain,
    setBoolWave,
    setRainIsON,
  ];

  const Configsetarr = [setConfig1, setConfig2];

  const Config1DataRain = {
    WIDTH: 2,
    HEIGHT: 40,
    SHEET: 3,
    DROPWIDTH: 0.1,
    DROPS: 100,
  };
  const Config1DataLight = {
    startX: window.innerWidth / 2,
    startY: 0,
    Distance: 75,
    Thickness: 3,
    Time: 100,
    Branches: 1,
    Iterator: 0,
    Roughness: 100,
    Chance: 5,
    Hue: 300,
    Sat: 100,
    Light: 50,
  };
  const Config2DataRain = {
    WIDTH: 3,
    HEIGHT: 30,
    SHEET: 4,
    DROPWIDTH: 0.3,
    DROPS: 300,
  };

  const Config2DataLight = {
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

  //Function used to control button and cofig states
  function FirstTrue(Trueset, Exclude, Falseset) {
    for (let i = 0; i < Falseset.length; i++) {
      if (Falseset[i] !== Exclude) {
        Falseset[i](false);
      }
    }
    for (let i = 0; i < Trueset.length; i++) {
      if (Trueset[i] !== Exclude) {
        Trueset[i](true);
      }
    }
  }
  //used to set configurations to on

  const Config1Check = () => {
    FirstTrue([setConfig1, setRainIsON], [], [...AniStates, ...Configsetarr]);
  };

  const Config2Check = () => {
    FirstTrue([setConfig2, setConfig2], [], [...AniStates, ...Configsetarr]);
  };
  //Html code
  return (
    <>
      {/* When true arguments */}
      <div>
        {BoolStar && <Stars />}
        {BoolRain && (
          <Rain RainProps={Config1DataRain} LightningProps={Config1DataLight} />
        )}
        {BoolSand && <Sand />}
        {BoolWave && <WaveFunction />}

        {Config1 && (
          <Rain RainProps={Config1DataRain} LightningProps={Config1DataLight} />
        )}
        {Config2 && (
          <Rain RainProps={Config2DataRain} LightningProps={Config2DataLight} />
        )}
      </div>
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      <div className="PageContainer" ref={pageContainerRef}>
        <div className="Buttons">
          <button
            onClick={() =>
              FirstTrue([setBoolStar], [], [...AniStates, ...Configsetarr])
            }
          >
            Stars
          </button>
          <button
            onClick={() => {
              FirstTrue(
                [setBoolRain, setRainIsON],
                [],
                [...AniStates, ...Configsetarr]
              );
            }}
          >
            Rain
          </button>
          <button
            onClick={() =>
              FirstTrue([setBoolSand], [], [...AniStates, ...Configsetarr])
            }
          >
            Sand
          </button>
          <button onClick={() => FirstTrue([])}>Wave</button>
        </div>
        {RainIsON && (
          <div className="OptionsButtons">
            <button onClick={Config1Check}>Vibro</button>
            <button onClick={Config2Check}>Sun</button>
            <button>Test</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Buttons;
