import React from "react";
import "./style.css";
import { lightMode } from "../../../assets";
import { useSelector } from "react-redux";
const Toggle = ({ isToggled, handleToggle }) => {
  const customizedChatData = useSelector((state) => state.state.chatData);
  return (
    <div
      className={`toggle-button ${isToggled ? "toggled" : ""}`}
      onClick={handleToggle}
    >
      <div className="toggle-image-container">
        <div
          className="wrapper"
          style={{
            backgroundColor: customizedChatData?.theme_color || "#fb5521",
          }}
        >
          <img className="toggle_icon" src={lightMode} alt="" />
        </div>
      </div>
    </div>
  );
};

export { Toggle };
