import React, { useRef, useState, useEffect } from "react";
import MainWasm from "../MainWasm.jsx";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";
import Particle from "../AnimationLogic/Particle.jsx";
import DragonEye from "../Images/DragonEye.jsx";
function Interface() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const DragonEyeRef = useRef(null);
  const HighlightRef = useRef(null);
  const [Mouse, setMouse] = useState({ x: 0, y: 0 });
  const [Play, setPlay] = useState(true);
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
  function Grow() {
    //Styles
    //New size and centering
    containerRef.current.style.width = `100%`;
    containerRef.current.style.height = `100%`;
  }
  //Moving the eye and gradient
  function FollowCursor() {
    if (DragonEyeRef.current) {
      const InnerEye = DragonEyeRef.current.querySelector("#InnerEye");
      const Radial = DragonEyeRef.current.querySelector("#paint0_radial_5_35");
      const rect = DragonEyeRef.current.getBoundingClientRect();
      // Calculate the mouse position relative to the DragonEye container
      const mouseX = Mouse.x - rect.left;
      const mouseY = Mouse.y - rect.top;
      //Get a offset target
      const targetX = (mouseX - rect.width / 2) * 0.03;
      const targetY = (mouseY - rect.height / 2) * 0.015;

      // Get the current transform values of the for lerp
      const currentTransform = InnerEye.style.transform.match(
        /translate\(([-\d.]+)px, ([-\d.]+)px\)/
      );
      const currentX = currentTransform ? parseFloat(currentTransform[1]) : 0;
      const currentY = currentTransform ? parseFloat(currentTransform[2]) : 0;
      // Interpolate between the current position and the target position
      const lerp = (start, end, t) => start + (end - start) * t;
      const smoothX = lerp(currentX, targetX, 0.1);
      const smoothY = lerp(currentY, targetY, 0.1);
      // Apply the new position to the InnerEye
      InnerEye.style.transform = `translate(${smoothX}px, ${smoothY}px)`;

      // Update the radial gradient's center position with the same offset
      if (Radial) {
        const gradientTargetX = 94 + targetX * 3.5;
        const gradientTargetY = 94 + targetY * 3.5;
        const gradientSmoothX = lerp(94, gradientTargetX, 0.1);
        const gradientSmoothY = lerp(94, gradientTargetY, 0.1);

        Radial.setAttribute(
          "gradientTransform",
          `translate(${gradientSmoothX} ${gradientSmoothY}) rotate(90) scale(74)`
        );
      }
    }
  }
  //Alter the highlight size based on the panel elements its highlighting
  function HighLightSize() {
    const Highlight = HighlightRef.current;
    Object.keys(Panel).forEach((key, index) => {
      if (Panel[key]) {
        const El = document.getElementById(`PanelElementId${index + 1}`);
        if (Highlight && El) {
          const computedStyle = window.getComputedStyle(El);
          const width = parseFloat(computedStyle.width); // Convert width to a number
          Highlight.style.width = `${width + 25}px`; // Add 100 and set the width
          Highlight.style.height = computedStyle.height; // Match the height
        }
      }
    });
  }
  useEffect(() => {
    HighLightSize();
  }, [Panel]);

  useEffect(() => {
    if (DragonEyeRef.current) {
      FollowCursor();
    }
  }, [Mouse]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

  return (
    <div>
      <div className="HeaderContainer">
        <div className="SacrificeContainer"></div>
        <div className="EyeContainer">
          <DragonEye ref={DragonEyeRef} />
        </div>
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
            <h1>Star's</h1>
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
          {/* Panel 5 */}
          <div
            id="PanelElementId5"
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
