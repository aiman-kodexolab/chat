import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ChatbotButton from "./components/chatBotButton/index.jsx";
import { verifyKey } from "./API/api.js";

// Function to render the chatbot in the given container
window.renderChatbot = async (containerId) => {
  const container = document.getElementById(containerId);

  if (container) {
    const scriptTag = document.getElementById("chatbot-script");
    const apiKey = scriptTag.getAttribute("data-key");
    const root = ReactDOM.createRoot(container);
    root.render(<ChatbotButton apiKey={apiKey} />);
  } else {
    console.error(`Container with ID ${containerId} not found.`);
  }
};

// Default rendering for the main app
const rootElement = document.getElementById("root");
// if (rootElement) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }
