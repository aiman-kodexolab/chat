import React, { useEffect, useMemo, useState } from "react";
import Chatbot from "../chatbot/Chatbot.jsx";
import "./style.css";
import { Widget, darkLogo } from "../../assets";
import { useGetProfileQuery, useVerifyKeyQuery } from "../../redux/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../../redux/state.js";
import { RxCross2 } from "react-icons/rx";
import { s3Url } from "../../utils/constant.js";

const ChatbotButton = ({
  apiKey = "cb-JnYD017p2RgbY4Gzi70ppptImT4u2vgKpKnvhgjG6bGdzv8U",
}) => {
  if (!localStorage.getItem("isLight")) {
    localStorage.setItem("isLight", "false");
  }

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const isLight = localStorage.getItem("isLight");

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

  const closeWelcome = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    if (clientBusinessData?.data) {
      dispatch(setChat(clientBusinessData?.data.chat_customization));
      localStorage.setItem(
        "business_id",
        JSON.stringify(clientBusinessData?.data?.business_profile?.business_id)
      );
    }
  }, [clientBusinessData?.data]);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(true);
    }, 1000);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    closeWelcome();
  };
  const customizedChatData = useSelector((state) => state.state.chatData);

  const imageUrl = useMemo(() => {
    return customizedChatData.avatar_picture
      ? `${s3Url}/${customizedChatData.avatar_picture}`
      : "";
  }, [customizedChatData]);

  return (
    <>
      {data && (
        <div className="chatbot_wrapper">
          {isOpen && <Chatbot />}
          <div
            className={`circle_button ${isLight === "true" ? "light" : ""} ${
              isOpen ? "button_open" : ""
            }`}
            style={{
              backgroundColor: isOpen
                ? customizedChatData?.header_color
                : isLight === "true"
                ? "white"
                : "black",
            }}
            onClick={toggleChat}
          >
            {isOpen ? (
              <RxCross2 size={22} strokeWidth={2} />
            ) : (
              <>
                <div className="widget_wrap">
                  <img
                    className="widget open_icon"
                    alt=""
                    src={imageUrl ? imageUrl : Widget}
                  />
                  <div
                    className={`online_status ${
                      isLight === "true" ? "light" : ""
                    }`}
                  ></div>
                </div>
              </>
            )}
          </div>
          {showWelcome && (
            <div
              className={`welcome_text_wrapper ${
                showWelcome ? "open" : "closing"
              }`}
            >
              <div className="text_header">
                <div>
                  <img alt="" src={Widget} />
                  <img className="kodexia_logo" alt="" src={darkLogo} />
                </div>
                <div onClick={closeWelcome}>
                  <RxCross2 size={20} color="black" className="cross_icon" />
                </div>
              </div>
              <div className="welcome_text">
                Explore, discover, and if you stumble upon any uncertainties,
                our doors are open for questions!
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
