import React, { useRef, useState, useEffect } from "react";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";
import Particle from "../AnimationLogic/Particle.jsx";

function Interface() {
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

  //RainIsON is used to check if rain is on or off
  const [RainIsON, setRainIsON] = useState(false);
  const [StarsIsON, setStarsIsON] = useState(false);
  const [ParticleIsON, setParticleIsON] = useState(false);
  const [SandIsON, setSandIsON] = useState(false);
  //Activate animation/preset these are the first animation presets that are activated
  const [BoolStar, setBoolStar] = useState(false);
  const [BoolSand, setBoolSand] = useState(false);
  const [BoolRain, setBoolRain] = useState(false);
  const [BoolParticle, setBoolParticle] = useState(false);
  //Configuration presets
  const [Config2Rain, setConfig2Rain] = useState(false);
  const [Config2Star, setConfig2Star] = useState(false);
  const [Config2Particle, setConfig2Particle] = useState(false);

  const AniStates = [
    setBoolStar,
    setBoolSand,
    setBoolRain,
    setBoolParticle,
    setRainIsON,
    setStarsIsON,
    setParticleIsON,
    setSandIsON,
  ];

  const Configsetarr = [setConfig2Rain, setConfig2Star, setConfig2Particle];

  //Rain data for configurations

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
    Time: 200,
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

  if (BoolRain) {
    document.documentElement.style.setProperty("--HUE", Config1DataLight.Hue);
  }

  if (Config2Rain) {
    document.documentElement.style.setProperty("--HUE", Config2DataLight.Hue);
  }

  const StarConfig1 = {
    Color: "red",
    Color2: "orange",
    Glow: "red",
  };

  const StarConfig2 = {
    Color: "blue",
    Color2: "cyan",
    Glow: "blue",
  };

  const ParticleConfig1 = {
    Fire: true,
  };

  const ParticleConfig2 = {
    SunOn: true,
  };

  const SandReset = {
    Reset: false,
  };

  //Function used to control button and cofig states
  function FirstTrue(Trueset, Falseset) {
    for (let i = 0; i < Falseset.length; i++) {
      if (Falseset[i]) {
        Falseset[i](false);
      }
    }
    for (let i = 0; i < Trueset.length; i++) {
      if (Trueset[i]) {
        Trueset[i](true);
      }
    }
    console.log(BoolStar);
  }

  //On click functions for the buttons

  const ConfigSandReset = () => {
    SandReset.Reset = true;
    console.log(SandReset.Reset);
  };

  const Config2RainCheck = () => {
    FirstTrue([setConfig2Rain, setRainIsON], [...AniStates, ...Configsetarr]);
  };

  const Config2StarCheck = () => {
    FirstTrue([setConfig2Star, setStarsIsON], [...AniStates, ...Configsetarr]);
  };

  const Config2ParticleCheck = () => {
    FirstTrue(
      [setConfig2Particle, setParticleIsON],
      [...AniStates, ...Configsetarr]
    );
    console.log(BoolParticle);
  };

  //Html code
  return (
    <>
      {/* When true arguments */}
      <div>
        {BoolStar && <Stars StarsProps={StarConfig1} />}

        {BoolRain && (
          <Rain RainProps={Config1DataRain} LightningProps={Config1DataLight} />
        )}

        {BoolSand && <Sand SandProps={SandReset} />}

        {BoolParticle && <Particle ParticleProps={ParticleConfig1} />}
        {/* Configuration */}
        {Config2Rain && (
          <Rain RainProps={Config2DataRain} LightningProps={Config2DataLight} />
        )}

        {Config2Star && <Stars StarsProps={StarConfig2} />}

        {Config2Particle && <Particle ParticleProps={ParticleConfig2} />}
      </div>
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      <div className="PageContainer" ref={pageContainerRef}>
        <div className="Buttons">
          <button
            onClick={() =>
              FirstTrue(
                [setBoolStar, setStarsIsON],
                [...AniStates, ...Configsetarr]
              )
            }
          >
            Stars
          </button>
          <button
            onClick={() => {
              FirstTrue(
                [setBoolRain, setRainIsON],
                [...AniStates, ...Configsetarr]
              );
            }}
          >
            Rain
          </button>
          <button
            onClick={() =>
              FirstTrue(
                [setBoolSand, setSandIsON],
                [...AniStates, ...Configsetarr]
              )
            }
          >
            Sand
          </button>
          <button
            onClick={() =>
              FirstTrue(
                [setBoolParticle, setParticleIsON],
                [...AniStates, ...Configsetarr]
              )
            }
          >
            Particle
          </button>
        </div>
        {RainIsON && (
          <div className="OptionsButtons">
            <button onClick={Config2RainCheck}>Vibro</button>
          </div>
        )}
        {StarsIsON && (
          <div className="OptionsButtons">
            <button onClick={Config2StarCheck}>Blue</button>
          </div>
        )}
        {ParticleIsON && (
          <div className="OptionsButtons">
            <button onClick={Config2ParticleCheck}>Sun</button>
          </div>
        )}
        {SandIsON && (
          <div className="OptionsButtons">
            <button onClick={ConfigSandReset}>Time-reset</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Interface;
