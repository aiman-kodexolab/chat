import React, { useState } from "react";
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Dropdown, Widget } from "../../assets";
import { useVerifyKeyQuery } from "../../redux/api.js";

const ChatbotButton = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useVerifyKeyQuery(
    { apiKey },
    {
      refetchOnMountOrArgChange: true,
      skip: !apiKey,
    }
  );

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {data && (
        <div className="chatbot_wrapper">
          {isOpen && <Chatbot />}
          <div className={"circle_button"} onClick={toggleChat}>
            {isOpen ? (
              <img className="close_icon" src={Dropdown} />
            ) : (
              <img className="open_icon" src={Widget} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
