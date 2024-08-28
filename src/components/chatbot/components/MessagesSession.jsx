import React, { useEffect, useRef, useState } from "react";
import "../style.css";
import TextBlock from "./TextBlock";
import InputField from "./InputField";
import { useGetChatHistoryQuery } from "../../../redux/api";
import { formatTime, socketUrl } from "../../../utils/constant";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Dropdown } from "../../../assets";

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
  const endRef = useRef();
  const socket = useRef(null)
  const [scrolled, setScrolled] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const containerRef = useRef();
  const botTime = formatTime();
  const isHuman = useRef(false);
  const customizedChatData = useSelector((state) => state.state.chatData);
  const inputFieldStyle = {
    border: "1px solid",
    borderImageSource: "linear-gradient(90deg, #079485 0%, #115588 100%)",
  };

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  function scrollToEnd() {
    endRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }

  const debouncedScrollToEnd = debounce(scrollToEnd, 100);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < 200) {
        setNewMessages([]);
        setScrolled(false);
      } else {
        setScrolled(true);
      }
    };

    containerRef?.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!scrolled) {
      debouncedScrollToEnd();
    }
  }, [chatArray, scrolled]);

  useEffect(() => {

    const sio = io(socketUrl, {
      transports: ["websocket"],
    })

    sio.on("connect", (data) => {
      console.log("client connected")
    })


    sio.on("client connected", (data) => {
      const currentSession = JSON.parse(localStorage.getItem("currentSession"))
      if (typeof currentSession === "object") {
        if (currentSession?._id) {
          sio.emit("join", {
            session_id: currentSession?._id
          })
        }
        if (currentSession?.is_joined) {
          isHuman.current = currentSession?.is_joined
        }
      }
    })

    sio.on("released", (data) => {
      isHuman.current = false
    })

    sio.on("ai_chat_message", (msg) => {
      const botTime = formatTime();
      setChatArray((prevDataSets) => [
        ...prevDataSets,
        {
          type: "bot",
          content: msg?.sentence,
          created_on: botTime,
        },
      ]);
      setChatLoad(false);
    })

    sio.on("entered", (data) => {
      isHuman.current = true
    });

    sio.on("done", (msg) => {
      if (msg?.chat_completed && msg?.sentence) {
        setChatArray((prevDataSets) => [
          ...prevDataSets,
          {
            type: "bot",
            content: msg?.sentence,
            created_on: botTime,
          },
        ]);
        setNewMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: msg?.sentence,
            created_on: botTime,
          },
        ]);
        setChatLoad(false);
      }
    });

    sio.on("disconnect", () => {
      console.log("WebSocket disconnected:");
    });

    socket.current = sio
    return () => {
      sio.disconnect()
    }
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
    debouncedScrollToEnd();

    if (!messages?.trim()) {
      return;
    }
    if (isHuman.current) {
      setChatLoad(false);
    } else {
      setChatLoad(true);
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

      socket.current?.emit("chat_message", {
        type: "user",
        content: sanitizedMessage,
        email: email,
        session_id: JSON.parse(localStorage.getItem("currentSession"))?._id,
        business_id: JSON.parse(localStorage.getItem("business_id")),
        agent_response: "",
        created_on: sessionCreated,
      });
      setMessages("");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        className={`chat-container ${status ? "expanded" : "collapsed"}`}
      >
        {chatHistoryLoader && (
          <Skeleton
            height={40}
            width={"85%"}
            baseColor="#01BFB726"
            highlightColor="#10ddd3"
            duration={3}
          />
        )}
        {chatHistoryLoader && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <Skeleton
              height={70}
              containerClassName="width-80"
              baseColor="#01BFB726"
              highlightColor="#10ddd3"
              duration={3}
            />
          </div>
        )}
        {chatHistoryLoader && (
          <Skeleton
            height={70}
            width={"85%"}
            baseColor="#01BFB726"
            highlightColor="#10ddd3"
            duration={3}
          />
        )}
        {Array.isArray(chatArray) &&
          chatArray?.map((item, index) => {
            if (item?.type === "user") {
              return (
                <TextBlock key={item._id} isUser={true} time={item?.created_on}>
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
        <div ref={endRef} />
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
      {scrolled && (
        <>
          {newMessages?.length > 0 && (
            <div className="unread_message">{newMessages?.length}</div>
          )}
          <div className="scroll_container" onClick={scrollToEnd}>
            <img className="scroll" alt="" src={Dropdown} />
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesSession;
