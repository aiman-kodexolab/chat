import React from "react";
import "./style.css";
import SessionContainer from "../SessionContainer";
import { useSelector } from "react-redux";
import { VscSend } from "../../../Icon";
import Button from "../../../common/Button";

const ConversationsScreen = ({
  conversationList,
  isToggled,
  onSessionClick,
  startSession,
  isFormLoading,
}) => {
  const customizedChatData = useSelector((state) => state.state.chatData);
  return (
    <div className="conversations-wrapper">
      <div className="conversations">
        {Array.isArray(conversationList) && conversationList.length > 0 ? (
          conversationList.map((item, index) => (
            <div className="session-wrapper">
              <SessionContainer
                key={index}
                item={item}
                name={item?.user_name}
                onClick={onSessionClick}
                isToggled={isToggled}
              />
            </div>
          ))
        ) : (
          <p className={`no-conversation-text ${isToggled ? "light" : ""}`}>
            No conversations available
          </p>
        )}
      </div>

      <div className="session_box">
        <Button
          className="submit-button"
          onClick={startSession}
          isLoading={isFormLoading}
          style={{
            backgroundColor: customizedChatData?.theme_color || "#fb5521",
            color: customizedChatData?.font_color || "white",
          }}
        >
          New Conversation
          <VscSend />
        </Button>
      </div>
    </div>
  );
};

export { ConversationsScreen };
