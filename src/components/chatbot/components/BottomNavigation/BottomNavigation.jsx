import React from "react";
import "./style.css";
import { darkLogo, logo } from "../../../../assets";
import { GoHomeFill } from "react-icons/go";
import { BiConversation } from "react-icons/bi";
import { useSelector } from "react-redux";

const BottomNavigation = ({ isToggled, activeTab, handleActiveTab }) => {
  const customizedChatData = useSelector((state) => state.state.chatData);

  return (
    <footer>
      <div className={`navigation-wrapper ${isToggled ? "light" : ""}`}>
        <div
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleActiveTab("home")}
          style={{
            "--active-color":
              activeTab === "home" ? customizedChatData?.theme_color || "" : "",
          }}
        >
          <GoHomeFill size={25} />
          Home
        </div>
        <div
          className={`nav-item ${
            activeTab === "conversation" || activeTab === "form" ? "active" : ""
          }`}
          onClick={() => handleActiveTab("conversation")}
          style={{
            "--active-color":
              activeTab === "conversation" || activeTab === "form"
                ? customizedChatData?.theme_color || ""
                : "",
          }}
        >
          <BiConversation size={25} />
          Conversation
        </div>
      </div>
      <div className={`powered-by-wrapper ${isToggled ? "light" : ""}`}>
        <span className={`powered-by ${isToggled ? "light" : ""}`}>
          Powered by
        </span>
        <img
          className={`powered-by-logo ${isToggled ? "light" : ""}`}
          src={isToggled ? darkLogo : logo}
          alt=""
        />
      </div>
    </footer>
  );
};

export { BottomNavigation };
