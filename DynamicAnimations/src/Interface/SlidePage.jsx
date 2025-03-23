import React, { useRef, useState, useEffect } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import MainWasm from "../MainWasm.jsx";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";
import Particle from "../AnimationLogic/Particle.jsx";

function Interface() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [Play, setPlay] = useState(false);
  const [Panel, setPanel] = useState({
    PanelElement1: true,
    PanelElement2: false,
    PanelElement3: false,
    PanelElement4: false,
    PanelElement5: false,
  });

  function togglePanel(panelName) {
    setPanel((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === panelName;
        return acc;
      }, {});
      return newState;
    });
  }
  const StarProps = {
    Color: "Blue",
    Color2: "Blue",
    Glow: "True",
    Linear: "True",
    Lerp: "False",
    NonLinear: "False",
  };

  useEffect(() => {
    const canvasContainer = containerRef.current;
    if (containerRef.current && Play == false) {
      // Access the canvasContainer element here
      canvasContainer.classList.add("grow");
      Grow();
    } else {
      canvasContainer.classList.remove("grow");
      canvasContainer.style.width = `50%`;
      canvasContainer.style.height = `50%`;
    }
  }, [Play]);

  function Grow() {
    //Styles
    //New size and centering
    containerRef.current.style.width = `100%`;
    containerRef.current.style.height = `100%`;
  }

  return (
    <div>
      <div className="HeaderContainer">
        <div className="PlayContainer" onClick={() => setPlay(!Play)}>
          <div className={`PlayPause ${Play ? "Active" : ""}`}>
            <div className={`PlayIcon ${Play ? "Active" : ""}`}></div>
          </div>
          <div className={`PlayText ${Play ? "Active" : ""}`}>Play</div>
        </div>
      </div>
      <div className="ButtonContainer">
        <div className="Panel">
          {/* Panel 1 */}
          <div
            className="PanelItem"
            onClick={() => togglePanel("PanelElement1")}
          >
            <div
              className={`Highlight ${
                Object.keys(Panel).findIndex((key) => Panel[key]) + 1
                  ? `Active${
                      Object.keys(Panel).findIndex((key) => Panel[key]) + 1
                    }`
                  : ""
              }`}
            ></div>
            <h1>Star's</h1>
          </div>
          {/* Panel 2 */}
          <div
            className="PanelItem"
            onClick={() => togglePanel("PanelElement2")}
          >
            <h1>Converge</h1>
          </div>
          {/* Panel 3 */}
          <div
            className="PanelItem"
            onClick={() => togglePanel("PanelElement3")}
          >
            <h1>Sand</h1>
          </div>
          {/* Panel 4 */}
          <div
            className="PanelItem"
            onClick={() => togglePanel("PanelElement4")}
          >
            <h1>Rain</h1>
          </div>
          {/* Panel 5 */}
          <div
            className="PanelItem"
            onClick={() => togglePanel("PanelElement5")}
          >
            <h1>Particle</h1>
          </div>
        </div>
      </div>
      <div className="CanvasContainer" ref={containerRef}>
        {Panel.PanelElement1 && (
          <Stars canvasRef={canvasRef} stateProp={Play} />
        )}
        {Panel.PanelElement2 && <MainWasm />}
        {Panel.PanelElement3 && <Sand canvasRef={canvasRef} stateProp={Play} />}
        {Panel.PanelElement4 && <Rain canvasRef={canvasRef} stateProp={Play} />}
        {Panel.PanelElement5 && (
          <Particle canvasRef={canvasRef} stateProp={Play} />
        )}
      </div>
    </div>
  );
}

export default Interface;
