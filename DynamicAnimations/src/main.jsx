import React from "react";
import ReactDOM from "react-dom/client";
//Main Component/control interface
import Interface from "./Interface/SlidePage.jsx";
//Css
import "./Canvas.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
//Wasm
import WasmTest from "./AnimationLogic/WebAsm/WasmTest.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Interface />
      <WasmTest />
    </BrowserRouter>
  </React.StrictMode>
);
