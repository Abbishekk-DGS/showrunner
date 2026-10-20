import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import config from "./config/portfolio";
import App from "./App";
import "./index.css";

const { theme, profile } = config;

// Apply the theme from the config
const root = document.documentElement.style;
root.setProperty("--accent", theme.accent);
root.setProperty("--accent-deep", theme.accentDeep);
root.setProperty("--ink", theme.ink);
root.setProperty("--surface", theme.surface);
root.setProperty("--font-display", quote(theme.fonts.display));
root.setProperty("--font-body", quote(theme.fonts.body));
root.setProperty("--font-serif-family", quote(theme.fonts.serif));
document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.ink);

// Load the Google Fonts the theme asks for
if (theme.fonts.load.length) {
  const families = theme.fonts.load.map((f) => "family=" + f.replace(/ /g, "+")).join("&");
  const fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.append(fonts);
}

document.title = `${profile.name} | Home`;

/** A single family name needs quotes; a stack already has them. */
function quote(font: string) {
  return font.includes(",") || font.includes('"') ? font : `"${font}"`;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
