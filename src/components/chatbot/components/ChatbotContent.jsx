import React, { useEffect, useState } from "react";
import "../style.css";
import NewConversationBtn from "./NewConverationBtn";
import { GoBack, SendMsg } from "../../../assets";
import TransitionInput from "../../transitionInput/TransitionInput";
import { getUserSession } from "../../../API/api";
import SessionContainer from "./SessionContainer";

export default function ChatbotContent({
  values,
  chat,
  isFormActive,
  goBackForm,
  errors,
  systemId,
  startSession,
  handleSubmit,
  handleChange,
  goBack,
  touched,
}) {
  // useEffect(() => {
  //   const result = getUserSession("GET", systemId, "");
  //   console.log("tttttt", result);
  // }, []);

  const arr = [
    {
      is_form_filled: true,
      _id: "1",
      status: "closed",
      user_name: "Dayyan",
      first_message: "Hi",
    },
    {
      is_form_filled: false,
      _id: "12",
      status: "live",
      user_name: "Muhammad Dayyan",
      first_message: "sup",
    },
    {
      is_form_filled: true,
      _id: "13",
      status: "live",
      user_name: "Fahad",
      first_message: "salam",
    },
    {
      is_form_filled: false,
      _id: "14",
      status: "favorite",
      user_name: "Usman Ahmed",
      first_message: "kello",
    },
    {
      is_form_filled: true,
      _id: "15",
      status: "live",
      user_name: "Ali",
      first_message: "",
    },
  ];

  return (
    <div className={`${isFormActive ? "form_content" : "chatbot_content"}`}>
      {!isFormActive ? (
        <div style={{ position: "relative" }}>
          <div className="content-heading">
            <p className="chat-heading">Hi there</p>
            <p className="chat-text">
              This tab is for checking if the chatbot is perfectly trained.
            </p>
          </div>

          <div className="conversations">
            {arr.map((item, index) => (
              <SessionContainer
                key={index}
                userName={item?.user_name}
                firstMessage={item?.first_message}
                status={item?.status}
                onClick={() => {}}
              />
            ))}
          </div>
          {chat ? (
            <>
              <div className="session_box">
                <NewConversationBtn
                  className="start_session"
                  onClick={startSession}
                />
              </div>
            </>
          ) : (
            <div className="no_session_box">
              <NewConversationBtn className="no_session" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="form-container">
            <div className="form-header">
              <img
                src={GoBack}
                alt=""
                className="go-back-icon"
                onClick={goBack}
              />
              <p className="form-instruction">
                Please provide your email address and phone number here in case
                the live chat gets disconnected.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-body">
                <TransitionInput
                  label="Your Name"
                  required
                  value={values?.userName}
                  onChange={handleChange("userName")}
                  error={
                    touched?.userName && errors?.userName
                      ? errors?.userName
                      : null
                  }
                />
                <TransitionInput
                  label="Your Email"
                  required
                  value={values?.email}
                  onChange={handleChange("email")}
                  error={touched?.email && errors?.email ? errors?.email : null}
                />
                <TransitionInput
                  label="Your Phone Number"
                  // value={values.phone_number}
                  // onChange={handleChange("phone_number")}
                  // error={
                  //   touched?.phone_number && errors?.phone_number
                  //     ? errors?.phone_number
                  //     : null
                  // }
                />
              </div>
              <div className="form-footer">
                <button
                  type="submit"
                  // disabled={loading}
                  className="submit-button"
                >
                  <img src={SendMsg} alt="" className="send-icon" />
                  <p className="submit-text">New Chat</p>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* {isFormActive && (
        <>
          {console.log("form--->", isFormActive)}
          <div className="form-container">
            <div className="form-header">
              <img
                src={GoBack}
                alt=""
                className="go-back-icon"
                onClick={() => {
                  setIsFormActive(false);
                  setGoBackForm(true);
                  // refetch();
                  // resetForm();
                }}
              />
              <p className="form-instruction">
                Please provide your email address and phone number here in case
                the live chat gets disconnected.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-body">
                <TransitionInput
                  label="Your Name"
                  required
                  // value={values?.user_name}
                  // onChange={handleChange("user_name")}
                  // error={
                  //   touched?.user_name && errors?.user_name
                  //     ? errors?.user_name
                  //     : null
                  // }
                />
                <TransitionInput
                  label="Your Email"
                  required
                  // value={values.email}
                  // onChange={handleChange("email")}
                  // error={
                  //   touched?.email && errors?.email ? errors?.email : null
                  // }
                />
                <TransitionInput
                  label="Your Phone Number"
                  // value={values.phone_number}
                  // onChange={handleChange("phone_number")}
                  // error={
                  //   touched?.phone_number && errors?.phone_number
                  //     ? errors?.phone_number
                  //     : null
                  // }
                />
              </div>
              <div className="form-footer">
                <button
                  type="submit"
                  // disabled={loading}
                  className="submit-button"
                >
                  <img src={SendMsg} alt="" className="send-icon" />
                  <p className="submit-text">New Chat</p>
                </button>
              </div>
            </form>
          </div>
        </>
      )} */}
    </div>
  );
}
