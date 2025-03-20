import React, { useRef, useState, useEffect } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
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
    canvasRef.current.style.width = `${newWidth}px`;
    canvasRef.current.style.height = `${newHeight}px`;
  }

  return (
    <div>
      <Stars StarsProps={StarProps} canvasRef={canvasRef} />
    </div>
  );
}

export default Interface;
