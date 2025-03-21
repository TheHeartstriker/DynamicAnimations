import React, { useRef, useState, useEffect } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { PlayIcon } from "@heroicons/react/24/solid";
import MainWasm from "../MainWasm.jsx";
import Stars from "../AnimationLogic/Stars.jsx";
import Rain from "../AnimationLogic/Rain.jsx";
import Sand from "../AnimationLogic/Sand.jsx";
import Particle from "../AnimationLogic/Particle.jsx";

function Interface() {
  const canvasRef = useRef(null);
  const StarProps = {
    Color: "Blue",
    Color2: "Blue",
    Glow: "True",
    Linear: "True",
    Lerp: "False",
    NonLinear: "False",
  };

  useEffect(() => {
    if (canvasRef.current) {
      // Access the canvas element here
      const canvas = canvasRef.current;
      canvas.classList.add("shrink");
      Shrink();
    }
  }, []);

  function Shrink() {
    const ShrinkFactor = 0.5;
    const newWidth = window.innerWidth * ShrinkFactor;
    const newHeight = window.innerHeight * ShrinkFactor;
    //Styles
    //New size and centering
    canvasRef.current.style.width = `50vw`;
    canvasRef.current.style.height = `50vh`;
  }

  return (
    <div>
      <div className="HeaderContainer">
        <div className="PlayContainer">
          <div className="PlayPause">
            <PlayIcon className="PlayIcon" />
          </div>
          <div className="PlayText">Play</div>
        </div>
      </div>
      <div className="ButtonContainer">
        <div className="Panel">
          <div className="PanelItem">
            <h1>Star's</h1>
          </div>
          <div className="PanelItem">
            <h1>Converge</h1>
          </div>
          <div className="PanelItem">
            <h1>Sand</h1>
          </div>
          <div className="PanelItem">
            <h1>Rain</h1>
          </div>
        </div>
      </div>
      <Stars StarsProps={StarProps} canvasRef={canvasRef} />
    </div>
  );
}

export default Interface;
