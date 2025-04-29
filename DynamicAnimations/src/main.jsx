import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
//Main Component/control interface
import Interface from "./pages/interface/slidePage.jsx";
//Css
import "./styles/canvas.css";
import "./styles/main.css";
import "./site.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Interface />
    </BrowserRouter>
  </StrictMode>
);
