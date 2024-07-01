import React, { useState } from 'react';
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Dropdown, Widget } from "../../assets";
import { useVisitorId } from '../../hooks/useVisitorId.js';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const systemId = useVisitorId();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='chatbot_wrapper'>
      {isOpen && <Chatbot />}
      <div className='circle_button' onClick={toggleChat}>
        {isOpen ? <img className="close_icon" src={Dropdown} />: <img className="open_icon" src={Widget} />}
      </div>
    </div>
  );
};

export default ChatbotButton;