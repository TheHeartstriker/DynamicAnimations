import { useState, useRef, useEffect } from "react";
import { animate, utils, stagger } from "animejs";
import BackGround from "../images/Background";
import { use } from "react";

function Background() {
  const backgroundRef = useRef(null);

  function animateBackground() {
    animate(".wave", {
      easing: "easeInOutSine",
      scale: [1, 1.1, 1],
      duration: 3000,
      delay: stagger(200, { start: 500, from: "center" }),
      loop: true,
      alternate: true,
    });
  }

  useEffect(() => {
    if (backgroundRef.current) {
      animateBackground();
    }
  }, []);

  return (
    <div className="Background">
      <BackGround ref={backgroundRef} />
    </div>
  );
}

export default Background;
