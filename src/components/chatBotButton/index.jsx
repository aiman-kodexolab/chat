import React, { useEffect, useState } from "react";
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Dropdown, Widget } from "../../assets";
import { useVisitorId } from "../../hooks/useVisitorId.js";
import { verifyKey } from "../../API/api.js";

const ChatbotButton = ({ key }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(async () => {
    const result = await verifyKey("GET", key);
    console.log("result---->key ", result);
  }, []);
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot_wrapper">
      {isOpen && <Chatbot />}
      <div className="circle_button" onClick={toggleChat}>
        {isOpen ? (
          <img className="close_icon" src={Dropdown} />
        ) : (
          <img className="open_icon" src={Widget} />
        )}
      </div>
    </div>
  );
};

export default ChatbotButton;
