import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
//Main Component/control interface
import Interface from "./pages/interface/slidePage.jsx";
import Mobile from "./components/mobile.jsx";
//Css
import "./styles/site.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Interface />
      {/* <Mobile /> */}
    </BrowserRouter>
  </StrictMode>
);
