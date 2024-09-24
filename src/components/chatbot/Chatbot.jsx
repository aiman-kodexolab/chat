import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import ChatHeader from "./components/ChatHeader";
import ChatbotContent from "./components/ChatbotContent";
import { useVisitorId } from "../../hooks/useVisitorId";
import MessagesSession from "./components/MessagesSession";
import {
  emailRegex,
  formatTime,
  phoneRegex,
  playNotificationSound,
  socketUrl,
} from "../../utils/constant";
import {
  useCreateSessionMutation,
  useDeleteChatMutation,
  useGetSessionsQuery,
  useSessionDetailsMutation,
} from "../../redux/api";
import io from "socket.io-client";
import { BottomNavigation } from "./components/BottomNavigation/BottomNavigation";
import { ConversationsScreen } from "./components/ConversationsScreen/ConversationsScreen";

const Chatbot = () => {
  const [, setChat] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false);
  const socket = useRef(null);
  const [values, setValues] = useState({
    userName: "",
    email: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    phone_number: "",
  });
  const [touched, setTouched] = useState({
    userName: false,
    email: false,
    phone_number: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [messagesSession, setMessagesSession] = useState(false);
  const isLight = localStorage.getItem("isLight");
  const [chatArray, setChatArray] = useState([]);
  const systemId = useVisitorId();
  const sessionCreated = formatTime();
  const [sessionId, setSessionId] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [isToggled, setIsToggled] = useState(
    isLight === "false" ? false : true
  );
  const [isFormSubmitLoading, setIsFormSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const userObj =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  const currentSession =
    localStorage.getItem("currentSession") &&
    JSON.parse(localStorage.getItem("currentSession"));

  //APIs
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const [deleteChat] = useDeleteChatMutation();
  const { data, refetch } = useGetSessionsQuery(
    {
      system_id: systemId,
    },
    {
      skip: !systemId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const [sessionDetail, { isLoading: sessionLoader }] =
    useSessionDetailsMutation();

  //APIs

  //Functions
  const startSession = async () => {
    try {
      const response = await createSession({
        system_id: systemId,
        created_on: sessionCreated,
        user_id: "",
        business_id: JSON.parse(localStorage.getItem("business_id")),
      });

      setSessionId(() => response?.data?.data?.session_id);

      socket.current.emit("join", {
        session_id: response?.data?.data?.session_id,
      });
      const userSession = {
        _id: response?.data?.data?.session_id,
      };
      localStorage.setItem("currentSession", JSON.stringify(userSession));
      setIsFormActive(true);
      setActiveTab("form");
    } catch (e) {
      console.log("Error starting session:", e);
    }
  };

  const sessionDetails = async () => {
    try {
      const apiBody = {
        user_name: values.userName,
        email: values.email,
        phone_number: values.phone_number,
        session_id: sessionId,
        business_id: JSON.parse(localStorage.getItem("business_id")),
        user_id: "",
      };
      const result = await sessionDetail(apiBody);
      const userSession = {
        is_form_filled: result?.data?.data?.is_form_filled,
        _id: result?.data?.data?.session_id,
        status: result?.data?.data?.status,
      };
      setSessionId(() => result?.data?.data?.session_id);

      localStorage.setItem("currentSession", JSON.stringify(userSession));
    } catch (e) {
      console.log("This error", e);
    }
  };

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
    setTouched({ ...touched, [field]: true });
    if (!submitAttempted) {
      setSubmitAttempted(true);
    }
  };

  const handleDeleteChat = async () => {
    try {
      setChatArray([]);
      await deleteChat({
        session_id: sessionId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const sio = io(socketUrl, {
      transports: ["websocket"],
    });

    sio.on("connect", (data) => {
      console.log("client connected");
    });

    sio.on("client connected", (data) => {
      console.log("data", data);
    });

    socket.current = sio;
    return () => {
      sio.disconnect();
    };
  }, []);

  const validate = () => {
    const newErrors = { userName: "", email: "", phone_number: "" };
    if (!values.userName) {
      newErrors.userName = "Name is required";
    }
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    if (values.phone_number && !phoneRegex.test(values.phone_number)) {
      newErrors.phone_number = "Phone number is invalid";
    }
    setErrors(newErrors);
    return !newErrors.userName && !newErrors.email && !newErrors.phone_number;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    localStorage.setItem("status", true);
    const userData = {
      userName: values.userName,
      email: values.email,
      phone_number: values.phone_number,
    };
    const userString = JSON.stringify(userData);
    localStorage.setItem("user", userString);

    const newErrors = { userName: "", email: "", phone_number: "" };
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
      const emailFormat = !emailRegex.test(values.email);
      if (emailFormat) {
        newErrors.email = "Email is invalid";
        hasErrors = true;
      }
    }
    if (values.phone_number && !phoneRegex.test(values.phone_number)) {
      newErrors.phone_number = "Phone number is invalid";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setTouched(newErrors);
    } else {
      setIsFormSubmitLoading(true);
      sessionDetails();
      localStorage.setItem(
        "user",
        JSON.stringify({
          userName: values.userName,
          email: values.email,
          phone_number: values.phone_number,
        })
      );
      setIsFormSubmitLoading(false);
      setEmail(values.email);
      resetForm();
      setMessagesSession(true);
      await playNotificationSound();
      setIsFormActive(false);
      handleActiveTab("home");
      setErrors({
        userName: "",
        email: "",
        phone_number: "",
      });
      setTouched({
        userName: "",
        email: "",
        phone_number: "",
      });
    }
  };

  const messageSessionBack = () => {
    localStorage.removeItem("currentSession");
    if (!chatLoad) {
      setMessagesSession(false);
    }
    setSessionId("");
    setChatArray([]);
    refetch();
  };

  const onSessionClick = async (item) => {
    const userSession = {
      is_form_filled: item?.is_form_filled,
      _id: item?._id,
      status: item?.status,
      is_joined: item?.is_joined,
    };
    if (item?.is_form_filled) {
      setChat(true);
      setMessagesSession(true);
      await playNotificationSound();
      setEmail(item?.email);
      setUserName(item?.user_name);
      localStorage.setItem("currentSession", JSON.stringify(userSession));
    } else {
      handleActiveTab("form");
      setIsFormActive(true);
    }
    if (item?.status === "closed") {
      localStorage.setItem("status", false);
    } else {
      localStorage.setItem("status", true);
    }
    setSessionId(() => item?._id);

    socket.current.emit("join", {
      session_id: item?._id,
    });
  };

  const resetForm = () => {
    setValues({ userName: "", email: "", phone_number: "" });
    setTouched({ userName: "", email: "", phone_number: "" });
    setErrors({ userName: "", email: "", phone_number: "" });
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  //Functions

  //useEffetcs
  useEffect(() => {
    localStorage.setItem("isLight", isToggled);
  }, [isToggled]);

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
  //useEffetcs

  const handleActiveTab = (selectedTab) => {
    if (selectedTab === "home" || selectedTab === "conversation") {
      refetch();
    }
    if (activeTab === "form" || activeTab === "home") {
      setIsFormActive(false);
    }
    setActiveTab(selectedTab);
  };

  return (
    <>
      <div className={"window_wrap"}>
        <div className={`window ${isToggled ? "light" : ""}`}>
          {messagesSession || currentSession?.is_form_filled ? (
            <MessagesSession
              email={email}
              userName={userName}
              sessionCreated={sessionCreated}
              sessionId={sessionId}
              chatArray={chatArray}
              setChatArray={setChatArray}
              chatLoad={chatLoad}
              setChatLoad={setChatLoad}
              isToggled={isToggled}
              sessionLoader={sessionLoader}
              messagesSession={messagesSession}
              messageSessionBack={messageSessionBack}
              handleDeleteChat={handleDeleteChat}
              isDisabled={chatArray.length}
              handleToggle={handleToggle}
            />
          ) : (
            <>
              {activeTab === "home" || activeTab === "form" ? (
                <>
                  <ChatHeader
                    isToggled={isToggled}
                    handleToggle={handleToggle}
                    activeTab={activeTab}
                  />
                  <ChatbotContent
                    values={values}
                    isFormActive={isFormActive}
                    errors={errors}
                    startSession={startSession}
                    handleSubmit={onSubmit}
                    handleChange={handleChange}
                    touched={touched}
                    conversationList={data?.data}
                    onSessionClick={onSessionClick}
                    isToggled={isToggled}
                    isFormLoading={isLoading}
                    isFormSubmitLoading={isFormSubmitLoading}
                  />
                </>
              ) : (
                <>
                  <ChatHeader
                    isToggled={isToggled}
                    handleToggle={handleToggle}
                    activeTab={activeTab}
                  />
                  <ConversationsScreen
                    conversationList={data?.data}
                    isToggled={isToggled}
                    onSessionClick={onSessionClick}
                    startSession={startSession}
                  />
                </>
              )}

              <BottomNavigation
                isToggled={isToggled}
                activeTab={activeTab}
                handleActiveTab={handleActiveTab}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
