import React, { useEffect, useState } from "react";
import { Widget } from "../../assets";
import "./style.css";
import ChatHeader from "./components/ChatHeader";
import ChatbotContent from "./components/ChatbotContent";
import { useVisitorId } from "../../hooks/useVisitorId";
import MessagesSession from "./components/MessagesSession";
import { formatTime } from "../../utils/constant";
import {
  useCreateSessionMutation,
  useDeleteChatMutation,
  useGetSessionsQuery,
  useSessionDetailsMutation,
} from "../../redux/api";

const Chatbot = () => {
  const [chat, setChat] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false);
  const [goBackForm, setGoBackForm] = useState(false);
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
  const isLight = localStorage.getItem("isLight");
  const [chatArray, setChatArray] = useState([]);
  const systemId = useVisitorId();
  const sessionCreated = formatTime();
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState(true);
  const [email, setEmail] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [isToggled, setIsToggled] = useState(
    isLight === "false" ? false : true
  );
  const [isFormSubmitLoading, setIsFormSubmitLoading] = useState(false);
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
      });
      setSessionId(response?.data?.data?.session_id);
      setIsFormActive(true);
    } catch (e) {
      console.log("Error starting session:", e);
    }
  };

  const sessionDetails = async () => {
    try {
      const apiBody = {
        user_name: values.userName,
        email: values.email,
        phone_number: values.phoneNumber,
        session_id: sessionId,
        user_id: "",
      };
      const result = await sessionDetail(apiBody);
      const userSession = {
        is_form_filled: result?.data?.data?.is_form_filled,
        session_id: result?.data?.data?._id,
        status: result?.data?.data?.status,
      };
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
      const response = await deleteChat({
        session_id: sessionId,
      });
    } catch (e) {
      console.log(e);
    }
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
      sessionDetails();
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
      resetForm();
      setMessagesSession(true);
      setIsFormActive(false);
      // }
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
    if (!userObj) {
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

  const onSessionClick = (item) => {
    const userSession = {
      is_form_filled: item?.is_form_filled,
      _id: item?._id,
      status: item?.status,
    };
    if (item?.is_form_filled) {
      setChat(true);
      setMessagesSession(true);
      setSessionId(item?._id);
      setEmail(item?.email);
      localStorage.setItem("currentSession", JSON.stringify(userSession));
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

  return (
    <>
      <div className={"window_wrap"}>
        <div className={"header"}>
          <div className={"rotated-half-circle"}></div>
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
            chatLoad={chatLoad}
            handleToggle={handleToggle}
            isToggled={isToggled}
          />
          {messagesSession || currentSession?.is_form_filled ? (
            <MessagesSession
              email={email}
              sessionCreated={sessionCreated}
              sessionId={sessionId}
              status={status}
              chatArray={chatArray}
              setChatArray={setChatArray}
              chatLoad={chatLoad}
              setChatLoad={setChatLoad}
              isToggled={isToggled}
              sessionLoader={sessionLoader}
            />
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
              conversationList={data?.data}
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
