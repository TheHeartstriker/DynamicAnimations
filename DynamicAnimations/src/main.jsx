import React from "react";
import ReactDOM from "react-dom/client";
//Main Component/control interface
import Interface from "./Interface/SlidePage.jsx";
import MainWasm from "./MainWasm.jsx";
//Css
import "./Canvas.css";
import "./Main.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Interface /> */}
      <MainWasm />
    </BrowserRouter>
  </React.StrictMode>
);
