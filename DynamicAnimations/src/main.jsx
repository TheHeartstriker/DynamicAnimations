import React from "react";
import ReactDOM from "react-dom/client";
//Main Component/control interface
import Interface from "./Interface/SlidePage.jsx";
//Css
import "./Canvas.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div>
      <Interface />
    </div>
  </React.StrictMode>
);
