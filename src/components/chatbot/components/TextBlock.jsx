import React from "react";
import Markdown from "../../Markdown";
import "../style.css";
import { replaceTags } from "../../../utils/constant";
import moment from "moment";

function TextBlock({ isToggled, isUser, children, time }) {
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
        style={{ whiteSpace: isUser && "pre-wrap" }}
      >
        {renderContent(children)}
      </div>
      <div className={`header-text ${isUser ? "header-user" : "header-bot"}`}>
        <p className={"time"}>
          {moment(time, "Do MMMM YYYY . h:mm A").format("Do MMM YYYY . h:mm A")}
        </p>
      </div>
    </div>
  );
}

export default TextBlock;
