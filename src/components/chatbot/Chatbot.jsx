import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Widget } from "../../assets";
import "./style.css";
import ChatHeader from "./components/ChatHeader";
import ChatbotContent from "./components/ChatbotContent";
import { useVisitorId } from "../../hooks/useVisitorId";
import {
  createSession,
  deleteChat,
  getChatHistory,
  getSessions,
  sessionDetail,
} from "../../API/api";
import MessagesSession from "./components/MessagesSession";
import InputField from "./components/InputField";
import { formatTime } from "../../utils/constant";

const Chatbot = () => {
  const [messages, setMessages] = useState("");
  const [input, setInput] = useState("");
  const [sendData, setSendData] = useState({});
  const [chat, setChat] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false);
  const [goBackForm, setGoBackForm] = useState(false);
  const [socket, setSocket] = useState(null);
  const [values, setValues] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    userName: false,
    email: false,
    phoneNumber: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [messagesSession, setMessagesSession] = useState(false);
  const [chatArray, setChatArray] = useState([]);
  const inputRef = useRef();
  const maxLength = 100;
  const [limit, setLimit] = useState(false);
  const [rows, setRows] = useState(1);
  const systemId = useVisitorId();
  const [text, setText] = useState("hello");
  const [conversationList, setConversationList] = useState([]);
  const sessionCreated = formatTime();
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState(true);
  const [email, setEmail] = useState("");
  const [chatLoad, setChatLoad] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (!text) {
      if (inputValue?.length <= maxLength) {
        setMessages(inputValue);
        setLimit(false);
      } else {
        setLimit(true);
      }
    } else {
      setMessages(inputValue);
    }
    updateRows(e.target);
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text");
    const existingData = messages || "";
    const newText = existingData + pasteData;
    setLimit(false);
    if (hasLineBreaks(pasteData)) {
      setRows(3);
    }
    if (newText.length > maxLength) {
      event.preventDefault();
      const truncatedText = newText.substring(0, maxLength);
      setMessages(truncatedText);
      setLimit(true);
    } else {
      updateRows({ value: newText });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage(event);
    }
  };

  const handleSubmitMessage = (event) => {
    sendMessage(event);
    setRows(1);
    setLimit(false);
  };

  function hasLineBreaks(text) {
    const lineBreakPattern = /\r?\n/;
    return lineBreakPattern.test(text);
  }

  const updateRows = (textarea) => {
    if (textarea.value.length === 0) {
      setRows(1);
      return;
    }
    textarea.style.height = "auto";
    const rowHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10
    );
    const newRows = Math.floor(textarea.scrollHeight / rowHeight);
    setRows(newRows <= 3 ? newRows : 3);
    textarea.style.height = "";
  };
  const sendMessage = (e) => {
    e.preventDefault();

    if (!messages?.trim()) {
      return;
    }
    // setChatLoad(true);
    setChatArray((prevChat) => [
      ...prevChat,
      {
        type: "user",
        content: messages,
        email: values?.email,
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

  const startSession = async () => {
    try {
      const data = {
        system_id: systemId,
        created_on: sessionCreated,
        user_id: "",
      };
      const result = await createSession("POST", data);
      setSessionId(result?.data?.session_id);
      setIsFormActive(true);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });

    setTouched({ ...touched, [field]: true });
    if (!submitAttempted) {
      setSubmitAttempted(true); // Set submitAttempted to true on first interaction with any field
    }
  };

  const handleDeleteChat = async (field) => {
    const data = {
      session_id: sessionId,
    };
    await deleteChat("DELETE", data);
    getAllSessions();
    setChatArray([]);
  };

  const validate = () => {
    const newErrors = { userName: "", email: "" };
    if (!values.userName) {
      newErrors.userName = "Name is required";
    }
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return !newErrors.userName && !newErrors.email;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const newErrors = { userName: "", email: "" };
    let hasErrors = false;

    setSubmitAttempted(true);

    if (!values?.userName) {
      newErrors.userName = "Name is required";
      hasErrors = true;
    }

    if (!values?.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else {
      const emailFormat = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      if (emailFormat) {
        newErrors.email = "Email is invalid";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      setTouched(newErrors);
    } else {
      const data = {
        user_name: values.userName,
        email: values.email,
        phone_number: values.phoneNumber,
        session_id: sessionId,
        user_id: "",
      };

      const result = await sessionDetail("PUT", data);
      if (result.status_code === 200) {
        setEmail(values.email);
        chatHistory(sessionId);
        getAllSessions();
        resetForm();
        setMessagesSession(true);
        setIsFormActive(false);
      }
      setErrors({
        userName: "",
        email: "",
        phoneNumber: "",
      });
      setTouched({
        userName: "",
        email: "",
        phoneNumber: "",
      });
    }
  };

  const goBack = () => {
    console.log("go back");
    setIsFormActive(false);
    setGoBackForm(true);
    setValues({
      userName: "",
      email: "",
      phoneNumber: "",
    });
    setErrors({
      userName: "",
      email: "",
      phoneNumber: "",
    });
    setTouched({
      userName: "",
      email: "",
      phoneNumber: "",
    });
  };

  useEffect(() => {
    if (systemId) {
      getAllSessions();
    }
  }, [systemId]);

  useEffect(() => {
    validate();
  }, [values, touched]);

  const getAllSessions = async () => {
    const result = await getSessions("GET", systemId);
    setConversationList(result.data);
  };

  useEffect(() => {
    const socket = io("web-chatbot-internal.onrender.com", {
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
        }
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const messageSessionBack = () => {
    if (!chatLoad) {
      setMessagesSession(false);
      setChatArray([]);
    }
  };

  const chatHistory = async (sessionId) => {
    const result = await getChatHistory("GET", sessionId);
    setChatArray(result.data);
  };
  const sessionOnClick = (item) => {
    if (item?.is_form_filled === true) {
      setChat(true);
      setMessagesSession(true);
      setSessionId(item?._id);
      chatHistory(item?._id);
      setEmail(item?.email);
    } else {
      setIsFormActive(true);
      setSessionId(item?._id);
    }
    if (item?.status === "closed") {
      setStatus(false);
    } else {
      setStatus(true);
    }
  };

  const resetForm = () => {
    setValues({ userName: "", email: "", phoneNumber: "" });
    setTouched({ userName: "", email: "", phoneNumber: "" });
    setErrors({ userName: "", email: "", phoneNumber: "" });
  };

  return (
    <>
      <div className="window_wrap">
        <div className="header">
          <div className="rotated-half-circle"></div>
          <div className="avatar_wrap">
            <img src={Widget} />
          </div>
        </div>
        <div className="window">
          <ChatHeader
            messagesSession={messagesSession}
            messageSessionBack={messageSessionBack}
            handleDeleteChat={handleDeleteChat}
            isDisabled={chatArray.length}
            chatLoad={chatLoad}
          />
          {messagesSession ? (
            <>
              <MessagesSession
                status={status}
                chatArray={chatArray}
                chatLoad={chatLoad}
              />
              {status ? (
                <InputField
                  style={{
                    border: "1px solid",

                    borderImageSource:
                      "linear-gradient(90deg, #079485 0%, #115588 100%)",
                  }}
                  disabled={false}
                  sendMessage={sendMessage}
                  className={"hello"}
                  value={messages}
                  setValue={setMessages}
                  waitingMessage={"Waiting for message"}
                  text={text}
                  rows={rows}
                  limit={limit}
                  maxLength={maxLength}
                  inputRef={inputRef}
                  handleInputChange={handleInputChange}
                  handlePaste={handlePaste}
                  handleKeyPress={handleKeyPress}
                  handleSubmitMessage={handleSubmitMessage}
                  hasLineBreaks={hasLineBreaks}
                  updateRows={updateRows}
                />
              ) : null}
            </>
          ) : (
            <ChatbotContent
              values={values}
              errors={errors}
              chat={chat}
              isFormActive={isFormActive}
              goBackForm={goBackForm}
              systemId={systemId}
              startSession={startSession}
              handleSubmit={onSubmit}
              handleChange={handleChange}
              goBack={goBack}
              touched={touched}
              conversationList={conversationList}
              sessionOnClick={sessionOnClick}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
