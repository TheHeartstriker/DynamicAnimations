import React, { useRef, useState, useEffect } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";
import Particle from "../AnimationLogic/Particle.jsx";

function Interface() {
  const pageContainerRef = useRef(null);
  //Used to see if a button is clicked
  const [Buttoncount, setButtoncount] = useState(0);
  //Timer used to make sure the slide is finished before it can trigger again
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
      pageContainerRef.current.offsetHeight;
      // Set animation
      pageContainerRef.current.style.setProperty("--start", "0%");
      pageContainerRef.current.style.setProperty("--end", "100%");
      pageContainerRef.current.style.animation = "Slide 1s linear forwards";
      setButtoncount(1);
      setTimer(0);
    }
    //Slide back aka right
    if (pageContainerRef.current && Buttoncount === 1 && Timer > 1.2) {
      // Remove the animation
      pageContainerRef.current.style.animation = "none";
      // Force a reflow
      pageContainerRef.current.offsetHeight;
      // Set animation
      pageContainerRef.current.style.setProperty("--start", "100%");
      pageContainerRef.current.style.setProperty("--end", "0%");
      pageContainerRef.current.style.animation = "Slide 1s linear forwards";
      setButtoncount(0);
      setTimer(0);
    }
  };

  //Data to pass to the animations
  //Base data for rain
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
    Distance: 100,
    Thickness: 3,
    Time: 180,
    Branches: 1,
    Roughness: 100,
    Chance: 5,
    Hue: 300,
    Sat: 100,
    Light: 50,
  };
  //Configuration 2 data
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
    Distance: 100,
    Thickness: 3,
    Time: 180,
    Branches: 1,
    Roughness: 100,
    Chance: 5,
    Hue: 190,
    Sat: 100,
    Light: 50,
  };

  //Base star preset
  const StarConfig1 = {
    Color: "red",
    Color2: "orange",
    Glow: "red",
  };
  //Configuration 2 star preset
  const StarConfig2 = {
    Color: "blue",
    Color2: "cyan",
    Glow: "blue",
  };
  //Base particle preset
  const ParticleConfig1 = {
    Fire: true,
    SunOn: false,
  };
  //Configuration 2 particle preset
  const ParticleConfig2 = {
    SunOn: true,
    Fire: false,
  };
  //Props for sand reset
  const SandReset = {
    Reset: false,
  };
  //Onclick function to reset the sand
  const ConfigSandReset = () => {
    SandReset.Reset = true;
  };

  const [StarProp, setStarProp] = useState(StarConfig1);
  const [RainProp, setRainProp] = useState(Config1DataRain);
  const [LightProp, setLightProp] = useState(Config1DataLight);
  const [ParticleProp, setParticleProp] = useState(ParticleConfig1);
  const [SandProp, setSandProp] = useState(SandReset);
  const [renderKey, setRenderKey] = useState(0); // State variable to force re-render

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [StarProp, RainProp, LightProp, ParticleProp, SandProp]);

  let location = useLocation();

  //Applys the color of the flash to the background
  useEffect(() => {
    console.log(ParticleProp);
    if (location.pathname === "/rain") {
    }
  }, [location.pathname]);

  // Html code
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/stars"
            element={
              <Stars key={renderKey} StarsProps={StarProp} customProp="value" />
            }
          />
          <Route
            path="/rain"
            element={
              <Rain
                key={renderKey}
                RainProps={RainProp}
                LightningProps={LightProp}
                customProp="value"
              />
            }
          />
          <Route
            path="/sand"
            element={
              <Sand key={renderKey} SandProps={SandProp} customProp="value" />
            }
          />
          <Route
            path="/particle"
            element={
              <Particle
                key={renderKey}
                ParticleProps={ParticleProp}
                customProp="value"
              />
            }
          />
        </Routes>
      </div>
      {/* Setting button in bottom left */}
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      {/* Interface for the buttons */}
      <div className="PageContainer" ref={pageContainerRef}>
        <div className="Buttons">
          <Link to="/stars">
            <button>Stars</button>
          </Link>
          <Link to="/rain">
            <button>Rain</button>
          </Link>
          <Link to="/sand">
            <button>Sand</button>
          </Link>
          <Link to="/particle">
            <button onClick={() => setParticleProp(ParticleConfig1)}>
              Particle
            </button>
          </Link>
        </div>
        {location.pathname === "/stars" && (
          <div className="OptionsButtons">
            <button onClick={() => setStarProp(StarConfig2)}></button>
          </div>
        )}
        {location.pathname === "/rain" && (
          <div className="OptionsButtons">
            <button
              onClick={() => {
                setRainProp(Config2DataRain);
                setLightProp(Config2DataLight);
              }}
            ></button>
          </div>
        )}
        {location.pathname === "/sand" && (
          <div className="OptionsButtons">
            <button onClick={ConfigSandReset}>Reset</button>
          </div>
        )}
        {location.pathname === "/particle" && (
          <div className="OptionsButtons">
            <button onClick={() => setParticleProp(ParticleConfig2)}></button>
          </div>
        )}
      </div>
    </>
  );
}

export default Interface;
