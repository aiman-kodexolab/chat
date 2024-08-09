import React, { useEffect, useRef, useState } from "react";
import "../style.css";
import TextBlock from "./TextBlock";
import InputField from "./InputField";
import { useGetChatHistoryQuery } from "../../../redux/api";
import { formatTime, socketUrl } from "../../../utils/constant";
import { io } from "socket.io-client";
import { ShimmerDiv } from "shimmer-effects-react";
import { useSelector } from "react-redux";

const MessagesSession = ({
  status,
  sessionId,
  chatLoad,
  setChatLoad,
  isToggled,
  email,
  sessionCreated,
  chatArray,
  setChatArray,
  sessionLoader,
}) => {
  const [messages, setMessages] = useState("");
  const [socket, setSocket] = useState(null);
  const endRef = useRef();
  const botTime = formatTime();
  const customizedChatData = useSelector((state) => state.state.chatData);
  const inputFieldStyle = {
    border: "1px solid",
    borderImageSource: "linear-gradient(90deg, #079485 0%, #115588 100%)",
  };

  function scrollToEnd() {
    endRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }

  useEffect(scrollToEnd, [chatArray]);

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket"],
    });
    setSocket(socket);
    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("connect_error", (error) => {
      console.log("WebSocket connection error:", error);
    });

    socket.on("done", (msg) => {
      if (msg?.chat_completed && msg?.sentence) {
        if (!msg?.fine_tuning) {
          setChatArray((prevDataSets) => [
            ...prevDataSets,
            {
              type: "bot",
              content: msg?.sentence,
              created_on: botTime,
            },
          ]);
          setChatLoad(false);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected:");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { isLoading: chatHistoryLoader, data: chatData } =
    useGetChatHistoryQuery(
      {
        session_id: sessionId,
      },
      {
        skip: !sessionId,
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    if (chatData?.data && !chatHistoryLoader) {
      setChatArray([
        {
          type: "bot",
          content:
            customizedChatData && customizedChatData?.current_welcome_message,
          created_on: botTime,
        },
        ...chatData.data,
      ]);
    }
  }, [chatData?.data]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!messages?.trim()) {
      return;
    }

    setChatArray((prevChat) => [
      ...prevChat,
      {
        type: "user",
        content: messages,
        email: email,
        created_on: sessionCreated,
      },
    ]);

    if (messages !== "") {
      const sanitizedMessage = messages
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      socket.emit("chat_message", {
        type: "user",
        content: sanitizedMessage,
        email: email,
        session_id: sessionId,
        is_joined: false,
        agent_response: "",
        created_on: sessionCreated,
      });
      setChatLoad(true);
      setMessages("");
    }
  };

  return (
    <>
      <div className={`chat-container ${status ? "expanded" : "collapsed"}`}>
        <ShimmerDiv
          loading={chatHistoryLoader}
          mode="dark"
          height={60}
          width={"85%"}
          rounded={0.3}
        />

        <ShimmerDiv
          mode="dark"
          height={50}
          width={"85%"}
          rounded={0.3}
          className="shimmer"
          loading={chatHistoryLoader}
        />

        <ShimmerDiv
          loading={chatHistoryLoader}
          mode="dark"
          height={100}
          width={"85%"}
          rounded={0.3}
        />
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
        {chatLoad && (
          <div className={`loader ${isToggled ? "light" : ""}`}></div>
        )}
        <div ref={endRef}></div>
      </div>
      <InputField
        style={inputFieldStyle}
        disabled={chatHistoryLoader || chatLoad || sessionLoader}
        sendMessage={sendMessage}
        value={messages}
        setValue={setMessages}
        waitingMessage={"Waiting for message"}
        isToggled={isToggled}
        theme={isToggled}
      />
    </>
  );
};

export default MessagesSession;
