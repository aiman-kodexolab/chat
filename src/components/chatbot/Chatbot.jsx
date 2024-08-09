import React, { useEffect, useState } from "react";
import { Widget } from "../../assets";
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
} from "../../utils/constant";
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
        phone_number: values.phone_number,
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
      playNotificationSound();
      setIsFormActive(false);
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

  const goBack = () => {
    refetch();
    setIsFormActive(false);
    setGoBackForm(true);
    if (!userObj) {
      setValues({
        userName: "",
        email: "",
        phone_number: "",
      });
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

  const onSessionClick = (item) => {
    const userSession = {
      is_form_filled: item?.is_form_filled,
      _id: item?._id,
      status: item?.status,
    };
    if (item?.is_form_filled) {
      setChat(true);
      setMessagesSession(true);
      playNotificationSound();
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

  return (
    <>
      <div className={"window_wrap"}>
        <div className={"header"}>
          <div className={"rotated-half-circle"}></div>
          <div className={`avatar_wrap ${isToggled ? "light" : ""}`}>
            <img src={Widget} alt="" />
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
              isFormActive={isFormActive}
              errors={errors}
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
