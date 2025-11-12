import { useRef, useState, useEffect } from "react";
import MainWasm from "../../mainWasm.jsx";
import Rain from "../animationLogic/rain.jsx";
import Sand from "../animationLogic/sand.jsx";
import Particle from "../animationLogic/particle/particle.jsx";
import Eye from "../../components/eye.jsx";
import PauseIcon from "../../../public/pauseIcon.jsx";
import PlayIcon from "../../../public/playIcon.jsx";
//Css
import "@/styles/canvas.css";
import "@/styles/main.css";
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
        const El = document.getElementById(`panel-element-id${index + 1}`);
        if (Highlight && El) {
          const computedStyle = window.getComputedStyle(El);
          const width = parseFloat(computedStyle.width);
          Highlight.style.width = `${width + 45}px`;
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
      <div className="header-container">
        <div className="sacrifice-container"></div>
        <Eye />
        <div className="play-container">
          <div
            className="play-element-container"
            onClick={() => setPlay(!Play)}
          >
            <div className={`play-pause ${Play ? "Active" : ""}`}>
              {Play ? <PauseIcon /> : <PlayIcon />}
            </div>
            <div className={`play-text ${Play ? "Active" : ""}`}>
              {Play ? "Pause" : "Play"}
            </div>
          </div>
        </div>
      </div>
      <div className="button-container">
        <div className="panel">
          {/* Panel 1 */}
          <div
            id="panel-element-id1"
            className="panel-item"
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
            id="panel-element-id2"
            className="panel-item"
            onClick={() => togglePanel("PanelElement2")}
          >
            <h1>Pixel</h1>
          </div>
          {/* Panel 3 */}
          <div
            id="panel-element-id3"
            className="panel-item"
            onClick={() => togglePanel("PanelElement3")}
          >
            <h1>Sand</h1>
          </div>
          {/* Panel 4 */}
          <div
            id="panel-element-id4"
            className="panel-item"
            onClick={() => togglePanel("PanelElement4")}
          >
            <h1>Rain</h1>
          </div>
        </div>
      </div>
      <div className="canvas-container" ref={containerRef}>
        {Panel.PanelElement1 && (
          <Particle canvasRef={canvasRef} stateProp={Play} />
        )}
        {Panel.PanelElement2 && (
          <MainWasm canvasRef={canvasRef} stateProp={Play} />
        )}
        {Panel.PanelElement3 && <Sand canvasRef={canvasRef} stateProp={Play} />}
        {Panel.PanelElement4 && <Rain canvasRef={canvasRef} stateProp={Play} />}
      </div>
      <div className="link-container">
        <div className="links">
          <a
            href="https://github.com/TheHeartstriker/DynamicAnimations"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            GitHub
          </a>
          <a
            href="https://www.kadenwildauer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Interface;
