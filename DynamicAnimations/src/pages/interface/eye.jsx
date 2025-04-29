import DragonEye from "../../images/DragonEye.jsx";
import { useState, useRef, useEffect } from "react";
import { animate } from "animejs";

function Eye() {
  const DragonEyeRef = useRef(null);
  const [Mouse, setMouse] = useState({ x: 0, y: 0 });
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
    if (DragonEyeRef.current) {
      FollowCursor();
    }
  }, [Mouse]);

  return (
    <div className="EyeContainer">
      <DragonEye ref={DragonEyeRef} />
    </div>
  );
}

export default Eye;
