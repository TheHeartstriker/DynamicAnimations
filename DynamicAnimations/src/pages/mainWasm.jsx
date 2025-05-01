import { useState, useEffect, useRef } from "react";
//
// Put a gun to my head and still would't be able to tell you why 50+ error when wasm loads
// It happen only here! My other tests never did this!
//
function MainWasm() {
  const [wasm, setWasm] = useState(null);
  const canvasRef = useRef(null);
  const isLoaded = useRef(false);
  const [AniType, setAniType] = useState(1);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Load WASM module
  useEffect(() => {
    const loadWasm = async () => {
      if (canvasRef.current && !wasm && !isLoaded.current) {
        try {
          console.log("Attempting to load WASM module...");
          const module = await import(
            "../wasm/build/DynamicAnimations.mjs?init"
          );
          const wasmInstance = await module.default({
            canvas: canvasRef.current,
            locateFile: (path, prefix) => {
              console.log(`Locating file: ${path}`);
              return `${prefix}${path}`;
            },
            print: (msg) => console.log(msg),
            printErr: (msg) => console.error(msg),
          });
          setWasm(wasmInstance);
          isLoaded.current = true;
          console.log("WASM module loaded successfully");
        } catch (error) {
          console.error("Failed to load WASM module:", error);
        }
      }
    };
    loadWasm();
  }, []);
  //Send width and height to wasm when needed
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = windowSize.width;
      canvasRef.current.height = windowSize.height;

      if (wasm) {
        wasm._setArguments(windowSize.height, windowSize.width, AniType);
      }
    }
  }, [windowSize, wasm, AniType]);

  return (
    <div>
      <canvas ref={canvasRef} id="wasmCanvas"></canvas>
    </div>
  );
}

export default MainWasm;
