import React, { useEffect, useState } from "react";
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Dropdown, Widget } from "../../assets";
import { useGetProfileQuery, useVerifyKeyQuery } from "../../redux/api.js";
import { useDispatch } from "react-redux";
import { setChat } from "../../redux/state.js";

const ChatbotButton = ({
  apiKey = "test-d2tBulR15jGZWIbZt0nivAP1nfSVnDtgPuk1zore_IXx6i9r",
}) => {
  if (!localStorage.getItem("isLight")) {
    localStorage.setItem("isLight", "false");
  }

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const { data } = useVerifyKeyQuery(
    { apiKey },
    {
      refetchOnMountOrArgChange: true,
      skip: !apiKey,
    }
  );
  const { data: clientBusinessData } = useGetProfileQuery(
    { apiKey },
    {
      refetchOnMountOrArgChange: true,
      skip: !apiKey,
    }
  );

  useEffect(() => {
    if (clientBusinessData?.data) {
      dispatch(setChat(clientBusinessData?.data.chat_customization));
    }
  }, [clientBusinessData?.data]);

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
              <img className="widget close_icon" alt="" src={Dropdown} />
            ) : (
              <img className="widget open_icon" alt="" src={Widget} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
