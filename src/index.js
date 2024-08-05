import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChatbotButton from "./components/chatBotButton/index.jsx";
import App from "./App.js"
import MyWidgetElement from "./class.js";
// Function to render the chatbot in the given container
window.renderChatbot = async (containerId) => {
  const container = document.getElementById(containerId);
  if (container) {
    const scriptTag = document.getElementById("chatbot-script");
    const apiKey = scriptTag.getAttribute("data-key");
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://develop.d1usksvjihc2w.amplifyapp.com/widgetStyles.css';
    shadowRoot.appendChild(linkElement);
    const shadowContainer = document.createElement('div');
    shadowRoot.appendChild(shadowContainer);
    const root = ReactDOM.createRoot(shadowContainer);
    root.render(<ChatbotButton apiKey={apiKey} />);
    // const root = ReactDOM.createRoot(container);
    // root.render(<ChatbotButton apiKey={apiKey} />);
  } else {
    console.error(`Container with ID ${containerId} not found.`);
  }
};
// Default rendering for the main app
// const rootElement = document.getElementById("root");
// if (rootElement) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }