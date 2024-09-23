import React from "react";
import "./style.css";
import { lightMode } from "../../../../assets";
const Toggle = ({ isToggled, handleToggle }) => {
  return (
    <div
      className={`toggle-button ${isToggled ? "toggled" : ""}`}
      onClick={handleToggle}
    >
      <div className="toggle-image-container">
        <div className="wrapper">
          <img className="toggle_icon" src={lightMode} alt="" />
        </div>
      </div>
    </div>
  );
};

export { Toggle };
