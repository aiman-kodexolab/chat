import React, { useState } from "react";
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Dropdown, Widget } from "../../assets";
import { useVerifyKeyQuery } from "../../redux/api.js";

const ChatbotButton = ({
  apiKey = "test-d2tBulR15jGZWIbZt0nivAP1nfSVnDtgPuk1zore_IXx6i9r",
}) => {
  if (!localStorage.getItem("isLight")) {
    localStorage.setItem("isLight", "false");
  }

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
