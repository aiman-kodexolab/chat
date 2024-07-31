import React from "react";
import { SendMsg } from "../../../assets";
import "../style.css";

const NewConversationBtn = ({
  onClick,
  isFormLoading,
  buttonSize,
  className,
  style,
}) => (
  <button
    className={`${className} ${
      isFormLoading && className === "no_session" ? "adjust_loader" : ""
    }`}
    onClick={onClick}
    disabled={isFormLoading}
    style={style}
  >
    <>
      {isFormLoading ? (
        <div className="new-conversation-loader"></div>
      ) : (
        <>
          <img
            src={SendMsg}
            alt=""
            className="send-msg-icon"
            style={{ width: "15px", height: "15px" }}
          />
          <p className="new-conversation-text">New Conversation</p>
        </>
      )}
    </>
  </button>
);

export default NewConversationBtn;
