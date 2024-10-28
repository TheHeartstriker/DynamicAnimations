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
  const [Colors, setColors] = useState({
    Color: "red",
    Color2: "orange",
    Glow: "red",
  });
  //Base star preset
  const StarConfig1 = {
    Color: "red",
    Color2: "orange",
    Glow: "red",
    Linear: true,
  };
  //Configuration 2 star preset
  const StarConfig2 = {
    Color: "blue",
    Color2: "cyan",
    Glow: "blue",
    Linear: true,
  };

  const StarConfig3 = {
    Color: "red",
    Color2: "Orange",
    Glow: "red",
    Lerp: true,
  };

  const StarConfig4 = {
    Color: "green",
    Color2: "yellow",
    Glow: "green",
    Linear: true,
    NonLinear: true,
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
  const [SandNum, setSandNum] = useState(0);

  const SandConfig1 = {
    StartHsl: 190,
    EndHsl: 260,
    Reset: SandNum,
    Speed: 0.25,
  };

  const SandConfig2 = {
    StartHsl: 0,
    EndHsl: 60,
    Reset: SandNum,
    Speed: 0.25,
  };

  const SandConfig3 = {
    StartHsl: 0,
    EndHsl: 360,
    Reset: SandNum,
    Speed: 0.8,
  };

  const [StarProp, setStarProp] = useState(StarConfig1);
  const [RainProp, setRainProp] = useState(Config1DataRain);
  const [LightProp, setLightProp] = useState(Config1DataLight);
  const [ParticleProp, setParticleProp] = useState(ParticleConfig1);
  const [SandProp, setSandProp] = useState(SandConfig1);
  const [renderKey, setRenderKey] = useState(0); // State variable to force re-render

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [StarProp, RainProp, LightProp, ParticleProp, SandProp]);

  let location = useLocation();

  //Applys the color of the flash to the background
  useEffect(() => {
    if (location.pathname === "/rain") {
      document.documentElement.style.setProperty("--HUE", LightProp.Hue);
    }
  }, [LightProp.Hue, location.pathname]);

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
            <button onClick={() => setStarProp(StarConfig2)}>Blue</button>
            <button onClick={() => setStarProp(StarConfig3)}>Lerp</button>
            <button onClick={() => setStarProp(StarConfig4)}>
              GoofyGravity
            </button>
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
            <button onClick={() => setSandProp(SandConfig1)}>Reset</button>
            <button onClick={() => setSandProp(SandConfig2)}>Lava</button>
            <button onClick={() => setSandProp(SandConfig3)}>Rainbow</button>
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
