import React from "react";
import "./style.css";
import NewConversationBtn from "../NewConverationBtn";
import SessionContainer from "../SessionContainer";

const ConversationsScreen = ({
  conversationList,
  isToggled,
  onSessionClick,
  startSession,
}) => {
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
        <NewConversationBtn className="start_session" onClick={startSession} />
      </div>
    </div>
  );
};

export { ConversationsScreen };
