import React from "react";
import "../style.css";
import { DeleteIcon, GoBack, Hamburger, Widget } from "../../../assets";

export default function ChatHeader({
  messagesSession,
  messageSessionBack,
  handleDeleteChat,
  isDisabled,
}) {
  return (
    <>
      <div className="window_header">
        <div className="icon_header">
          <div className="back" onClick={messageSessionBack}>
            {messagesSession && <img className="go-back-icon" src={GoBack} />}
          </div>

          <div>
            {messagesSession && (
              <button
                disabled={isDisabled ? false : true}
                className="hamburger"
                onClick={handleDeleteChat}
              >
                <img
                  className={`${isDisabled ? "hamburger_icon" : "grey_image"}`}
                  src={DeleteIcon}
                />
              </button>
            )}
            <div className="toggle">
              <img className="toggle_icon" src={Hamburger} />
            </div>
          </div>
        </div>
      </div>
      <hr className="line_break"></hr>
    </>
  );
}
