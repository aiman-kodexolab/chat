import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Widget } from "../../assets";
import "./style.css";
import ChatHeader from "./components/ChatHeader";
import ChatbotContent from "./components/ChatbotContent";
import { useVisitorId } from "../../hooks/useVisitorId";
// import  createSession,
// deleteChat,
//  getChatHistory,
// getSessions,
// sessionDetail,
// "../../API/api";
import MessagesSession from "./components/MessagesSession";
import InputField from "./components/InputField";
import { formatTime, socketUrl } from "../../utils/constant";
import {
  useCreateSessionMutation,
  useDeleteChatMutation,
  useGetChatHistoryQuery,
  useGetProfileQuery,
  useGetSessionsQuery,
  useSessionDetailsMutation,
} from "../../redux/api";

const Chatbot = () => {
  const [messages, setMessages] = useState("");
  // const [input, setInput] = useState("");
  // const [sendData, setSendData] = useState({});
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
  const endRef = useRef();
  // const maxLength = 100;
  const systemId = useVisitorId();
  const [text, setText] = useState("hello");
  const sessionCreated = formatTime();
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState(true);
  const [email, setEmail] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isFormSubmitLoading, setIsFormSubmitLoading] = useState(false);
  // const [isConversationListLoading, setIsConversationListLoading] =useState(false);
  const userObj =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  const currentSession =
    localStorage.getItem("currentSession") &&
    JSON.parse(localStorage.getItem("currentSession"));

  //APIs
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const [deleteChat, { isLoading: deleteChatLoader }] = useDeleteChatMutation();
  const [sessionDetail, { isLoading: loading }] = useSessionDetailsMutation();
  const {
    data,
    isLoading: getSessionLoader,
    refetch,
  } = useGetSessionsQuery(
    {
      system_id: systemId,
    },
    {
      skip: !systemId,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: profileData, isLoading: profileLoader } = useGetProfileQuery();
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
  //APIs

  //Functions
  function scrollToEnd() {
    endRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }

  //Functions

  //useEffects
  useEffect(scrollToEnd, [chatArray]);

  useEffect(() => {
    if (chatData?.data) {
      setChatArray(chatData?.data);
    }
    scrollToEnd();
    return () => {
      setChatArray([]);
    };
  }, [chatData]);

  useEffect(() => {
    if (userObj) {
      setValues(userObj);
    }
  }, [sessionId]);

  useEffect(() => {
    if (currentSession?.is_form_filled) {
      setSessionId(currentSession?._id);
      setMessagesSession(true);
    }
  }, [currentSession]);

  useEffect(() => {
    validate();
  }, [values, touched]);

  //useEffects

  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value;
  //   if (!text) {
  //     if (inputValue?.length <= maxLength) {
  //       setMessages(inputValue);
  //     } else {
  //     }
  //   } else {
  //     setMessages(inputValue);
  //   }
  //   updateRows(e.target);
  // };

  // const handlePaste = (event) => {
  //   const pasteData = event.clipboardData.getData("text");
  //   const existingData = messages || "";
  //   const newText = existingData + pasteData;
  //   if (hasLineBreaks(pasteData)) {
  //   }
  //   if (newText.length > maxLength) {
  //     event.preventDefault();
  //     const truncatedText = newText.substring(0, maxLength);
  //     setMessages(truncatedText);
  //   } else {
  //     updateRows({ value: newText });
  //   }
  // };

  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault();
  //      handleSubmitMessage(event);
  //   }
  // };

  // const handleSubmitMessage = (event) => {
  //   sendMessage(event);
  // };

  // function hasLineBreaks(text) {
  //   const lineBreakPattern = /\r?\n/;
  //   return lineBreakPattern.test(text);
  // }

  // const updateRows = (textarea) => {
  //   if (textarea.value.length === 0) {
  //     return;
  //   }
  //   textarea.style.height = "auto";
  //   const rowHeight = parseInt(
  //     window.getComputedStyle(textarea).lineHeight,
  //     10
  //   );
  //   const newRows = Math.floor(textarea.scrollHeight / rowHeight);
  //   textarea.style.height = "";
  // };

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
      const response = await createSession({
        system_id: systemId,
        created_on: sessionCreated,
        user_id: "",
      });
      console.log("rere", response?.data?.data);
      setSessionId(response?.data?.data?.session_id);
      setIsFormActive(true);
    } catch (e) {
      console.log("Error starting session:", e);
    }
  };

  // const startSessions = async () => {
  //   try {
  //     setIsFormLoading(true);
  //     const data = {
  //       system_id: systemId,
  //       created_on: sessionCreated,
  //       user_id: "",
  //     };
  //     // const result = await createSession("POST", data);
  //     setIsFormLoading(false);
  //     // setSessionId(result?.data?.session_id);
  //     setIsFormActive(true);
  //     // getAllSessions();
  //   } catch (error) {
  //     console.error("Error starting session:", error);
  //   }
  // };

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });

    setTouched({ ...touched, [field]: true });
    if (!submitAttempted) {
      setSubmitAttempted(true);
    }
  };

  const handleDeleteChat = async (field) => {
    try {
      const response = await deleteChat({
        session_id: sessionId,
      });
      setChatArray([]);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
    // await deleteChat("DELETE", data);
    // getAllSessions();
    // setChatArray([]);
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
    const userData = {
      userName: values.userName,
      email: values.email,
      phoneNumber: values.phoneNumber,
    };
    const userString = JSON.stringify(userData);
    localStorage.setItem("user", userString);

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
      setIsFormSubmitLoading(true);

      const data = {
        user_name: values.userName,
        email: values.email,
        phone_number: values.phoneNumber,
        session_id: sessionId,
        user_id: "",
      };

      const result = await sessionDetail(data);
      if (result.data.status_code === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            userName: values.userName,
            email: values.email,
            phoneNumber: values.phoneNumber,
          })
        );
        setIsFormSubmitLoading(false);
        setEmail(values.email);
        // getAllSessions();
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
    refetch();
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

  // useEffect(() => {
  //   if (systemId) {
  //     getAllSessions();
  //   }
  // }, [systemId]);

  // const getAllSessions = async () => {
  //   setIsConversationListLoading(true);

  //   setIsConversationListLoading(false);
  // };

  //"d2ge2om10dy7dl.cloudfront.net"

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
    refetch();
    console.log("go-back");
    localStorage.removeItem("currentSession");
    if (!chatHistoryLoader) {
      setMessagesSession(false);
      setMessages("");
      setChatArray([]);
    }
  };

  const onSessionClick = (item) => {
    console.log("onSessionClick", item);

    localStorage.setItem("currentSession", JSON.stringify(item));

    if (item?.is_form_filled === true) {
      setChat(true);
      setMessagesSession(true);
      setSessionId(item?._id);
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

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <>
      <div className="window_wrap">
        <div className="header">
          <div className="rotated-half-circle"></div>
          <div className={`avatar_wrap ${isToggled ? "light" : ""}`}>
            <img src={Widget} />
          </div>
        </div>
        <div className={`window ${isToggled ? "light" : ""}`}>
          <ChatHeader
            messagesSession={messagesSession}
            messageSessionBack={messageSessionBack}
            handleDeleteChat={handleDeleteChat}
            isDisabled={chatArray.length}
            chatLoad={chatHistoryLoader}
            handleToggle={handleToggle}
            isToggled={isToggled}
          />
          {messagesSession || currentSession?.is_form_filled ? (
            <>
              <MessagesSession
                status={status}
                chatArray={chatArray}
                chatLoad={chatLoad}
                isToggled={isToggled}
                endRef={endRef}
              />
              {status ? (
                <InputField
                  style={{
                    border: "1px solid",
                    borderImageSource:
                      "linear-gradient(90deg, #079485 0%, #115588 100%)",
                  }}
                  disabled={chatHistoryLoader}
                  sendMessage={sendMessage}
                  className={"hello"}
                  value={messages}
                  setValue={setMessages}
                  waitingMessage={"Waiting for message"}
                  text={text}
                  isToggled={isToggled}
                  theme={isToggled}
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
              conversationList={
                currentSession?.is_form_filled ? currentSession : data?.data
              }
              onSessionClick={onSessionClick}
              isToggled={isToggled}
              isFormLoading={isLoading}
              isFormSubmitLoading={isFormSubmitLoading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
