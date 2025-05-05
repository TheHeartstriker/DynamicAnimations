import { useState, useEffect, useRef } from "react";
import SDLModule from "./wasm/build/dynamicAnimations?init";

const loadWasm = async (canvas) => {
  const wasm = await SDLModule({
    canvas,
    wasi_snapshot_preview1: {
      proc_exit: (code) => {
        console.log(`WASM exited with code ${code}`);
      },
    },
  });
  return wasm;
};

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
    if (canvasRef.current) {
      const fetchWasm = async () => {
        if (canvasRef.current && !wasm && !isLoaded.current) {
          const wasmModule = await loadWasm(canvasRef.current);
          setWasm(wasmModule);
          isLoaded.current = true; // Mark as loaded
        }
      };

      fetchWasm();
    }
  }, [wasm]);

  // Window size event listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set arguments for the WASM module
  useEffect(() => {
    if (canvasRef.current) {
      // Update the canvas size to match the window size
      canvasRef.current.width = windowSize.width;
      canvasRef.current.height = windowSize.height;

      // Pass the updated size to the WASM module
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
