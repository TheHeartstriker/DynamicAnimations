import DragonEye from "../images/DragonEye.jsx";
import { useState, useRef, useEffect } from "react";
import { animate, createAnimatable } from "animejs";

function Eye() {
  const DragonEyeRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const preMouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef(null);

  function anitAnimate() {
    const innerEye = DragonEyeRef.current.querySelector("#InnerEye");
    const pupil = DragonEyeRef.current.querySelector("#BlackTri");
    const items = [innerEye, pupil].filter((item) => item);
    const animatable = items.map((element) =>
      createAnimatable(element, {
        x: 400,
        y: 400,
        ease: "ease(2)",
      })
    );
    console.log("Animatable:", animatable);
    return { animatable, items };
  }

  function radialUpdate(relX, relY) {
    if (!DragonEyeRef.current) return;
    const radial = DragonEyeRef.current.querySelector("#paint0_radial_5_35");
    if (!radial) return;

    const targetX = 94 + relX * 1.1;
    const targetY = 94 + relY * 1.1;

    radial.setAttribute(
      "gradientTransform",
      `translate(${targetX} ${targetY}) rotate(90) scale(74)`
    );
  }

  function eyeTracker(animatable, items) {
    if (!animatable || !items) {
      return;
    }
    items.forEach((item, index) => {
      //Bounding
      const boundingRect = item.getBoundingClientRect();
      const { top, left, width, height } = boundingRect;
      // Calculate the mouse position relative to the item
      const relativeX = mouseRef.current.x - left;
      const relativeY = mouseRef.current.y - top;
      let targetX, targetY;
      if (item.id === "InnerEye") {
        targetX = (relativeX - width / 2) * 0.03;
        targetY = (relativeY - height / 2) * 0.015;
      } else {
        targetX = (relativeX - width / 2) * 0.006;
        targetY = (relativeY - height / 2) * 0.003;
      }
      radialUpdate(targetX, targetY);
      animatable[index].x(targetX);
      animatable[index].y(targetY);
    });
  }
  //
  // Make the prev mouse check
  //
  useEffect(() => {
    const { animatable, items } = anitAnimate();
    function onMouseMove(event) {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    }
    function update() {
      eyeTracker(animatable, items);
      animationIdRef.current = requestAnimationFrame(update);
    }
    animationIdRef.current = requestAnimationFrame(update);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // useEffect(() => {
  //   if (DragonEyeRef.current) {
  //     FollowCursor();
  //   }
  // }, [Mouse]);

  return (
    <div className="EyeContainer">
      <DragonEye ref={DragonEyeRef} />
    </div>
  );
}

export default Eye;
