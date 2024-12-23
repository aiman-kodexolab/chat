import React, { useEffect, useRef, useState } from "react";
import "../style.css";
import TextBlock from "../../common/TextBlock";
import InputField from "./InputField";
import { useGetChatHistoryQuery } from "../../../redux/api";
import { formatTime, s3Url, socketUrl } from "../../../utils/constant";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Dropdown, Widget } from "../../../assets";
import ChatHeader from "./ChatHeader";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
  LuClipboardList,
} from "../../Icon";
import { v4 as uuidv4 } from "uuid";

const MessagesSession = ({
  sessionId,
  chatLoad,
  setChatLoad,
  isToggled,
  email,
  sessionCreated,
  chatArray,
  setChatArray,
  sessionLoader,
  messagesSession,
  messageSessionBack,
  handleDeleteChat,
  handleToggle,
  isDisabled
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [messages, setMessages] = useState("");
  const sessionStatus =
    localStorage.getItem("status") === "true" ? true : false;
  const endRef = useRef();
  const socket = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const containerRef = useRef();
  const botTime = formatTime();
  const isHuman = useRef(false);
  const customizedChatData = useSelector((state) => state.state.chatData);
  const [messageSelections, setMessageSelections] = useState({});

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
      query: { business_id: JSON.parse(localStorage.getItem("business_id")) },
    });

    sio.on("connect", (data) => {
      console.log("client connected");
    });

    sio.on("client connected", (data) => {
      const currentSession = JSON.parse(localStorage.getItem("currentSession"));
      if (typeof currentSession === "object") {
        if (!currentSession?.is_joined) {
          sio.emit("join", {
            session_id: currentSession?._id,
          });
        }
        if (currentSession?.is_joined) {
          sio.emit("rejoin", {
            session_id: currentSession?._id,
          });
          isHuman.current = currentSession?.is_joined;
        }
      }
    });

    sio.on("rejoined", (data) => {
      if (data?.session_detail) {
        const isJoinedByHuman = data?.session_detail?.is_joined;
        if (isJoinedByHuman) {
          isHuman.current = true;
        } else {
          isHuman.current = false;
        }
      }
      localStorage.setItem(
        "currentSession",
        JSON.stringify(data?.session_detail)
      );
    });

    sio.on("released", (data) => {
      isHuman.current = false;
      setChatArray((prevDataSets) => [
        ...prevDataSets,
        {
          type: "agent",
          content: data?.message,
          created_on: botTime,
        },
      ]);
      localStorage.setItem(
        "currentSession",
        JSON.stringify(data?.session_detail)
      );
    });

    sio.on("ai_chat_message", (msg) => {
      const botTime = formatTime();
      setChatArray((prevDataSets) => [
        ...prevDataSets,
        {
          id: uuidv4(),
          type: "bot",
          content: msg?.sentence,
          created_on: botTime,
        },
      ]);
      setChatLoad(false);
    });

    sio.on("entered", (data) => {
      isHuman.current = true;
      setChatArray((prevDataSets) => [
        ...prevDataSets,
        {
          type: "agent",
          content: data?.message,
          created_on: botTime,
        },
      ]);
      localStorage.setItem(
        "currentSession",
        JSON.stringify(data?.session_detail)
      );
    });

    sio.on("done", (msg) => {
      if (msg?.chat_completed && msg?.sentence) {
        setChatArray((prevDataSets) => [
          ...prevDataSets,
          {
            id: uuidv4(),
            type: "bot",
            content: msg?.sentence,
            created_on: botTime,
          },
        ]);
        setNewMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuidv4(),
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

    socket.current = sio;
    return () => {
      sio.disconnect();
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
          id: uuidv4(),
          type: "bot",
          content: customizedChatData && customizedChatData?.welcome_message,
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
        content: messages.trim(),
        email: email,
        created_on: sessionCreated,
      },
    ]);

    if (messages !== "") {
      const sanitizedMessage = messages
        .trim()
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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(id);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1000);
    });
  };

  const handleLikeClick = (id) => {
    setMessageSelections((prevSelections) => ({
      ...prevSelections,
      [id]: prevSelections[id] === "like" ? null : "like",
    }));
  };

  const handleDislikeClick = (id) => {
    setMessageSelections((prevSelections) => ({
      ...prevSelections,
      [id]: prevSelections[id] === "dislike" ? null : "dislike",
    }));
  };

  return (
    <>
      <ChatHeader
        messagesSession={messagesSession}
        messageSessionBack={messageSessionBack}
        handleDeleteChat={handleDeleteChat}
        isDisabled={chatArray.length || isDisabled}
        isLoading={chatLoad || sessionLoader}
        handleToggle={handleToggle}
        isToggled={isToggled}
      />
      <div
        ref={containerRef}
        className={`chat-container ${
          sessionStatus ? "expanded" : "collapsed"
        } `}
      >
        {chatHistoryLoader && (
          <Skeleton height={40} width={"85%"} duration={3} />
        )}
        {chatHistoryLoader && (
          <div className="chat-loader">
            <Skeleton height={70} containerClassName="width-80" duration={3} />
          </div>
        )}
        {chatHistoryLoader && (
          <Skeleton height={70} width={"85%"} duration={3} />
        )}

        {Array.isArray(chatArray) &&
          chatArray?.map((item) => {
            const currentSelection = messageSelections[item.id];
            if (item?.type === "user") {
              return (
                <div className="message-container-user">
                  <div>
                    <TextBlock
                      isToggled={isToggled}
                      key={item._id}
                      isUser={true}
                      time={item?.created_on}
                    >
                      {item?.content}
                    </TextBlock>
                  </div>
                </div>
              );
            } else if (item?.type === "bot") {
              return (
                <div className="message-container-bot">
                  <div className="text-block-wrapper">
                    <div className="bot-message-wrapper">
                      {customizedChatData?.avatar_picture ? (
                        <img
                          src={`${s3Url}/${customizedChatData?.avatar_picture}`}
                          alt=""
                          className="bot-message-logo"
                        />
                      ) : (
                        <img src={Widget} alt="" className="bot-message-logo" />
                      )}
                      <TextBlock
                        isToggled={isToggled}
                        key={item._id}
                        time={item?.created_on}
                        style={{
                          color: customizedChatData?.font_color || "white",
                          backgroundColor:
                            customizedChatData?.theme_color || "#fb5521",
                        }}
                      >
                        {item?.content}
                      </TextBlock>
                    </div>

                    <div className="actions-wrapper">
                      <div
                        className="actions"
                        style={{
                          backgroundColor:
                            customizedChatData?.theme_color || "#fb5521",
                        }}
                      >
                        <LuClipboardList
                          color="white"
                          size={15}
                          onClick={() =>
                            copyToClipboard(item?.content, item.id)
                          }
                          className="cursor-pointer "
                        />
                        {copiedMessageId === item.id && (
                          <div className="tooltip">Copied!</div>
                        )}{" "}
                        <>
                          {currentSelection === "like" ? (
                            <FaThumbsUp
                              color="white"
                              size={15}
                              onClick={() => handleLikeClick(item.id)}
                              className="cursor-pointer"
                            />
                          ) : (
                            <FaRegThumbsUp
                              color="white"
                              size={15}
                              onClick={() => handleLikeClick(item.id)}
                              className="cursor-pointer"
                            />
                          )}

                          {currentSelection === "dislike" ? (
                            <FaThumbsDown
                              color="white"
                              size={15}
                              onClick={() => handleDislikeClick(item.id)}
                              className="cursor-pointer"
                            />
                          ) : (
                            <FaRegThumbsDown
                              color="white"
                              size={15}
                              onClick={() => handleDislikeClick(item.id)}
                              className="cursor-pointer"
                            />
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else if (item?.type === "agent") {
              return (
                <div className="agent">
                  <div key={item.created_on} time={item?.created_on}>
                    {item?.content}
                  </div>
                  <p className="agent-time">{item?.created_on}</p>
                </div>
              );
            }
          })}
        {chatLoad && (
          <div className={`loader ${isToggled ? "light" : ""}`}></div>
        )}
        <div ref={endRef} />
      </div>
      {sessionStatus && (
        <InputField
          disabled={chatHistoryLoader || chatLoad || sessionLoader}
          sendMessage={sendMessage}
          value={messages}
          setValue={setMessages}
          waitingMessage={"Waiting for message"}
          isToggled={isToggled}
          theme={isToggled}
        />
      )}
      {scrolled && (
        <>
          {newMessages?.length > 0 && (
            <div
              className="unread_message"
              style={{
                backgroundColor: customizedChatData?.theme_color || "#fb5521",
              }}
            >
              {newMessages?.length}
            </div>
          )}
          <div
            className={`${
              sessionStatus ? "scroll_container" : "scroll_container_collapsed"
            }`}
            style={{
              backgroundColor: customizedChatData?.header_color || "#3e2248",
            }}
            onClick={scrollToEnd}
          >
            <img className="scroll" alt="" src={Dropdown} />
          </div>
        </>
      )}
    </>
  );
};

export default MessagesSession;
