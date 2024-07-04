import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Chatbot from "../src/components/chatbot/Chatbot.jsx";

// Function to render the chatbot in the given container
window.renderChatbot = (containerId) => {
  const container = document.getElementById(containerId);
  const scriptTag = document.getElementById('chatbot-script');
  const key = scriptTag.getAttribute("data-key");
  console.log("key", key);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<Chatbot />);
  } else {
    console.error(`Container with ID ${containerId} not found.`);
  }
};

// Default rendering for the main app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
