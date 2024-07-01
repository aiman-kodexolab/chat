import React from "react";
import Markdown from "../../Markdown";
import '../style.css';

function TextBlock({ isUser, name, children, time }) {
  const replaceTags = (text) => {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const renderContent = (content) => {
    if (isUser) {
      return <div dangerouslySetInnerHTML={{ __html: replaceTags(content) }} />;
    } else {
      return <Markdown markdown={content} />;
    }
  };

  return (
    <div className={`text-block ${isUser ? 'user' : 'bot'}`}>
      <div className="message" style={{ whiteSpace: isUser && "pre-wrap" }}>
        {renderContent(children)}
      </div>
      <div className={`header-text ${isUser ? 'header-user' : 'header-bot'}`}>
        {/* <p className={isUser ? "font-semibold" : "font-bold"}>
          {isUser ? (name ? name : "You") : (
            <span className="bot-name">Bot Builder</span>
          )}
        </p> */}
        <p className="time">{time}</p>
      </div>
    </div>
  );
}

export default TextBlock;
