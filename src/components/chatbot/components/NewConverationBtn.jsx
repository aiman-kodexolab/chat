import React from "react";
import "../style.css";
import { VscSend } from "react-icons/vsc";
import { useSelector } from "react-redux";

const NewConversationBtn = ({ onClick, isFormLoading, className, style }) => {
  const customizedChatData = useSelector((state) => state.state.chatData);
  const fontColor = customizedChatData?.font_color || "white";

  return (
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
            <p
              className="new-conversation-text"
              style={{
                color: fontColor,
              }}
            >
              New Conversation
            </p>
            <VscSend color={fontColor} />
          </>
        )}
      </>
    </button>
  );
};

export default NewConversationBtn;
