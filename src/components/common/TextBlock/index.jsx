import React from "react";
import Markdown from "../Markdown";
import "./style.css";
import { replaceTags } from "../../../utils/constant";

function TextBlock({ isToggled, isUser, children, style }) {
  const renderContent = (content) => {
    if (isUser) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: replaceTags(content) }}
          className={`text-content ${isToggled ? "light" : ""}`}
        />
      );
    } else {
      return <Markdown markdown={content ?? ""} />;
    }
  };
  return (
    <div className={`text-block ${isUser ? "user" : "bot"}`}>
      <div className={`message ${isToggled ? "light" : ""}`} style={style}>
        {renderContent(children)}
      </div>
    </div>
  );
}

export default TextBlock;
