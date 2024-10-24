import React from "react";
import Markdown from "../../Markdown";
import "../style.css";
import { replaceTags } from "../../../utils/constant";
import { useSelector } from "react-redux";

function TextBlock({ isToggled, isUser, children, time }) {
  const customizedChatData = useSelector((state) => state.state.chatData);

  const renderContent = (content) => {
    if (isUser) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: replaceTags(content) }}
          style={{
            lineHeight: "16px",
            fontFamily: "Poppins, sans-serif",
            color: isToggled ? "#444444" : "#000000",
          }}
        />
      );
    } else {
      return <Markdown markdown={content ?? ""} />;
    }
  };
  return (
    <div className={`text-block ${isUser ? "user" : "bot"}`}>
      <div
        className={`message ${isToggled ? "light" : ""}`}
        style={{
          whiteSpace: isUser && "pre-wrap",
          marginBottom: isUser && "10px",
          color: customizedChatData?.font_color || "white",
          backgroundColor: !isUser
            ? customizedChatData?.theme_color || "#fb5521"
            : "",
        }}
      >
        {renderContent(children)}
      </div>
    </div>
  );
}

export default TextBlock;
