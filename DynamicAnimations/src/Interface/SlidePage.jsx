import React, { useRef, useState, useEffect } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import MainWasm from "../MainWasm.jsx";
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
    HEIGHT: 50,
    SHEET: 3,
    DROPWIDTH: 2,
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
    HEIGHT: 50,
    SHEET: 4,
    DROPWIDTH: 2,
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

  //Configuration 2 data
  const Config3DataRain = {
    HEIGHT: 50,
    SHEET: 4,
    DROPWIDTH: 2,
    DROPS: 300,
    Wind: true,
    WindSpeed: 5,
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
  //State for the particle config presets need for this spefic animation
  const [StartHslParticle, setStartHslParticle] = useState(160);
  const [EndHslParticle, setEndHslParticle] = useState(260);
  const [Fire, setFire] = useState(false);
  const [Sun, setSun] = useState(false);

  //Base particle preset
  const ParticleConfig = {
    StartHsl: StartHslParticle,
    EndHsl: EndHslParticle,
    Fire: Fire,
    SunOn: Sun,
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
  //State variables for the animation presets / props
  const [StarProp, setStarProp] = useState(StarConfig1);
  const [RainProp, setRainProp] = useState(Config1DataRain);
  const [LightProp, setLightProp] = useState(Config1DataLight);
  const [ParticleProp, setParticleProp] = useState(ParticleConfig);
  const [SandProp, setSandProp] = useState(SandConfig1);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [StarProp, RainProp, LightProp, SandProp, ParticleProp]);

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
                ParticleProps={ParticleConfig}
                customProp="value"
              />
            }
          />
          <Route path="/" element={<MainWasm />} />
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
            <button id="StarBtn">Stars</button>
          </Link>
          <Link to="/">
            <button id="ConvergeBtn">Converge</button>
          </Link>
          <Link to="/rain">
            <button
              onClick={() => {
                setRainProp(Config1DataRain);
                setLightProp(Config1DataLight);
              }}
              id="RainBtn"
            >
              Rain
            </button>
          </Link>
          <Link to="/sand">
            <button id="Sandbtn">Sand</button>
          </Link>
          <Link to="/particle">
            <button
              onClick={() => {
                setParticleProp(ParticleConfig);
                setStartHslParticle(160);
                setEndHslParticle(260);
                setFire(true);
                setSun(false);
              }}
              id="ParticleBtn"
            >
              Particle
            </button>
          </Link>
        </div>
        {location.pathname === "/stars" && (
          <div className="OptionsButtons">
            <button onClick={() => setStarProp(StarConfig2)}>Blue</button>
            <button onClick={() => setStarProp(StarConfig3)}>Lerp</button>
            <button onClick={() => setStarProp(StarConfig4)}>
              Goofy Gravity
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
            >
              Vibro
            </button>
            <button
              onClick={() => {
                setRainProp(Config3DataRain);
                setLightProp(Config1DataLight);
              }}
            >
              Wind
            </button>
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
            <button
              onClick={() => {
                setParticleProp(ParticleConfig);
                setFire(false);
                setSun(true);
              }}
            >
              Point
            </button>
            <button
              onClick={() => {
                setParticleProp(ParticleConfig);
                setStartHslParticle(0);
                setEndHslParticle(60);
              }}
            >
              Fire
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Interface;
