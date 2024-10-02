import React from "react";
import "./style.css";
import { darkLogo, logo } from "../../../../assets";
import { GoHomeFill } from "react-icons/go";
import { BiConversation } from "react-icons/bi";

const BottomNavigation = ({ isToggled, activeTab, handleActiveTab }) => {
  return (
    <footer>
      <div className={`navigation-wrapper ${isToggled ? "light" : ""}`}>
        <div
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleActiveTab("home")}
        >
          <GoHomeFill size={25} />
          Home
        </div>
        <div
          className={`nav-item ${
            activeTab === "conversation" || activeTab === "form" ? "active" : ""
          }`}
          onClick={() => handleActiveTab("conversation")}
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
