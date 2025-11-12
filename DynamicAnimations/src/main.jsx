import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Interface from "./pages/interface/slidePage.jsx";
import Mobile from "./components/mobile.jsx";
import { isMobile } from "@/utils/mobile.jsx";
import "./styles/site.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>{isMobile() ? <Mobile /> : <Interface />}</BrowserRouter>
  </StrictMode>
);
