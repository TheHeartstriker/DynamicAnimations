import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
//Main Component/control interface
import Interface from "./Interface/SlidePage.jsx";
//Css
import "./Canvas.css";
import "./Main.css";
import "./Site.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Interface />
    </BrowserRouter>
  </StrictMode>
);
