import React from "react";
import "../style.css";
import { DeleteIcon, GoBack, darkMode, lightMode } from "../../../assets";

export default function ChatHeader({
  messagesSession,
  messageSessionBack,
  handleDeleteChat,
  isDisabled,
  chatLoad,
  handleToggle,
  isToggled,
}) {
  return (
    <>
      <div className="window_header">
        <div className="icon_header">
          <button
            className="back"
            disabled={chatLoad}
            onClick={messageSessionBack}
          >
            {messagesSession && (
              <img
                className={`${
                  !chatLoad
                    ? `go-back-icon ${isToggled ? "light" : ""}`
                    : "grey_back_icon"
                }`}
                src={GoBack} alt=""
              />
            )}
          </button>

          <div>
            {messagesSession && (
              <button
                disabled={isDisabled ? false : true}
                className={"hamburger"}
                onClick={handleDeleteChat}
              >
                <img
                  className={`${
                    isDisabled
                      ? `delete_chat_icon ${isToggled ? "light" : ""}`
                      : "grey_image"
                  }`}
                  src={DeleteIcon} alt=""
                />
              </button>
            )}
            <div
              className={`toggle-button ${isToggled ? "toggled" : ""}`}
              onClick={handleToggle}
            >
              <div className="toggle-image-container">
                <div className="wrapper">
                  <img
                    className="toggle_icon"
                    src={isToggled ? lightMode : darkMode} alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className={"line_break"}></hr>
    </>
  );
}
