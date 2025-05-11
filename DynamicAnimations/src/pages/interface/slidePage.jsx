import React, { useRef, useState, useEffect } from "react";
import Background from "../../components/background.jsx";
import MainWasm from "../../mainWasm.jsx";
import Rain from "../animationLogic/rain.jsx";
import Sand from "../animationLogic/sand.jsx";
import Particle from "../animationLogic/particle/particle.jsx";
import Eye from "../../components/eye.jsx";
function Interface() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const HighlightRef = useRef(null);
  const [Play, setPlay] = useState(true);
  const [Panel, setPanel] = useState({
    PanelElement1: true,
    PanelElement2: false,
    PanelElement3: false,
    PanelElement4: false,
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
  function Grow() {
    //Styles
    //New size and centering
    containerRef.current.style.width = `100%`;
    containerRef.current.style.height = `100%`;
  }

  //Alter the highlight size based on the panel elements its highlighting
  function HighLightSize() {
    const Highlight = HighlightRef.current;
    Object.keys(Panel).forEach((key, index) => {
      if (Panel[key]) {
        const El = document.getElementById(`PanelElementId${index + 1}`);
        if (Highlight && El) {
          const computedStyle = window.getComputedStyle(El);
          const width = parseFloat(computedStyle.width);
          Highlight.style.width = `${width + 25}px`;
          Highlight.style.height = computedStyle.height;
        }
      }
    });
  }
  useEffect(() => {
    HighLightSize();
  }, [Panel]);

  useEffect(() => {
    const canvasContainer = containerRef.current;
    const eyeContainer = document.querySelector(".EyeContainer");
    if (containerRef.current && Play == false) {
      // Access the canvasContainer element here
      canvasContainer.classList.add("grow");
      eyeContainer.classList.add("grow");
      Grow();
    } else {
      canvasContainer.classList.remove("grow");
      eyeContainer.classList.remove("grow");
      canvasContainer.style.width = `50%`;
      canvasContainer.style.height = `50%`;
    }
  }, [Play]);

  return (
    <div>
      <Background />
      <div className="HeaderContainer">
        <div className="SacrificeContainer"></div>
        <Eye />
        <div className="PlayContainer">
          <div className="PlayElementContainer" onClick={() => setPlay(!Play)}>
            <div className={`PlayPause ${Play ? "Active" : ""}`}>
              <div className={`PlayIcon ${Play ? "Active" : ""}`}></div>
            </div>
            <div className={`PlayText ${Play ? "Active" : ""}`}>
              {Play ? "Pause" : "Play"}
            </div>
          </div>
        </div>
      </div>
      <div className="ButtonContainer">
        <div className="Panel">
          {/* Panel 1 */}
          <div
            id="PanelElementId1"
            className="PanelItem"
            onClick={() => togglePanel("PanelElement1")}
          >
            <div
              ref={HighlightRef}
              className={`Highlight ${
                Object.keys(Panel).findIndex((key) => Panel[key]) + 1
                  ? `Active${
                      Object.keys(Panel).findIndex((key) => Panel[key]) + 1
                    }`
                  : ""
              }`}
            ></div>
            <h1>Particle</h1>
          </div>
          {/* Panel 2 */}

          <div
            id="PanelElementId2"
            className="PanelItem"
            onClick={() => togglePanel("PanelElement2")}
          >
            <h1>Converge</h1>
          </div>
          {/* Panel 3 */}
          <div
            id="PanelElementId3"
            className="PanelItem"
            onClick={() => togglePanel("PanelElement3")}
          >
            <h1>Sand</h1>
          </div>
          {/* Panel 4 */}
          <div
            id="PanelElementId4"
            className="PanelItem"
            onClick={() => togglePanel("PanelElement4")}
          >
            <h1>Rain</h1>
          </div>
        </div>
      </div>
      <div className="CanvasContainer" ref={containerRef}>
        {Panel.PanelElement1 && (
          <Particle canvasRef={canvasRef} stateProp={Play} />
        )}
        {Panel.PanelElement2 && <MainWasm />}
        {Panel.PanelElement3 && <Sand canvasRef={canvasRef} stateProp={Play} />}
        {Panel.PanelElement4 && <Rain canvasRef={canvasRef} stateProp={Play} />}
      </div>
      <div className="LinkContainer">
        <div className="Links">
          <a
            href="https://github.com/TheHeartstriker/DynamicAnimations"
            target="_blank"
            rel="noopener noreferrer"
            className="Link"
          >
            GitHub
          </a>
          <a
            href="https://www.kadenwildauer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="Link"
          >
            Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Interface;
