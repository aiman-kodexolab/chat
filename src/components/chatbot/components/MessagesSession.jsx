import React, { useEffect, useRef } from "react";
import "../style.css";
import TextBlock from "./TextBlock";

const MessagesSession = ({ status, chatArray, chatLoad, isToggled }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatArray]);

  return (
    <div className={`chat-container ${status ? "expanded" : "collapsed"}`}>
      {Array.isArray(chatArray) &&
        chatArray?.map((item, index) => {
          if (item?.type === "user") {
            return (
              <TextBlock key={index} isUser={true} time={item?.created_on}>
                {item?.content}
              </TextBlock>
            );
          } else if (item?.type === "bot") {
            return (
              <TextBlock key={item._id} time={item?.created_on}>
                {item?.content}
              </TextBlock>
            );
          }
        })}
      {chatLoad && <div className={`loader ${isToggled ? "light" : ""}`}></div>}
      <div ref={endRef}></div>
    </div>
  );
};

export default MessagesSession;
