import React, { useEffect, useState } from "react";
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Dropdown, Widget } from "../../assets";
import { verifyKey } from "../../API/api.js";

const ChatbotButton = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  useEffect(() => {
    const checkKey = async () => {
      try {
        const result = await verifyKey("GET", apiKey);
        setIsApiKeyValid(result);
      } catch (error) {
        console.error("Error verifying key:", error);
      }
    };

    checkKey();
  }, [apiKey]);
  const toggleChat = () => {
    if (isApiKeyValid) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={"chatbot_wrapper"}>
      {isOpen && <Chatbot />}
      <div
        className={`${isApiKeyValid ? "circle_button" : "disabled_button"}`}
        onClick={toggleChat}
      >
        {isOpen ? (
          <img className={"close_icon"} src={Dropdown} />
        ) : (
          <img className={"open_icon"} src={Widget} />
        )}
      </div>
    </div>
  );
};

export default ChatbotButton;
