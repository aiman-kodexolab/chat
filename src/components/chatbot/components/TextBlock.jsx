import React from "react";
import Markdown from "../../Markdown";
import "../style.css";
import { replaceTags } from "../../../utils/constant";

function TextBlock({ isUser, children, time }) {
  const renderContent = (content) => {
    if (isUser) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: replaceTags(content) }}
          style={{ lineHeight: "16px", fontFamily: "Poppins, sans-serif" }}
        />
      );
    } else {
      return <Markdown markdown={content ?? ""} />;
    }
  };

  return (
    <div className={`text-block ${isUser ? "user" : "bot"}`}>
      <div className={"message"} style={{ whiteSpace: isUser && "pre-wrap" }}>
        {renderContent(children)}
      </div>
      <div className={`header-text ${isUser ? "header-user" : "header-bot"}`}>
        <p className={"time"}>{time}</p>
      </div>
    </div>
  );
}

export default TextBlock;
