import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./styles.css";
import "./academy.css";
import "./professional.css";
import "./experience.css";

// React 애플리케이션 시작점
createRoot(document.getElementById("root")).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App)
  )
);
