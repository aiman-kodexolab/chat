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
  conversationList,
  sessionOnClick
}) {

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
            {conversationList?.map((item, index) => (
              <SessionContainer
                key={index}
                item={item}
                onClick={sessionOnClick}
              />
            ))}
          </div>
          {conversationList?.length ? (
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
                  value={values.phone_number}
                  onChange={handleChange("phone_number")}
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
    </div>
  );
}