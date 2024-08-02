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
  sessionOnClick,
  isToggled,
  isFormLoading,
  isFormSubmitLoading,
  isConversationListLoading,
}) {
  return (
    <div className={`${isFormActive ? "form_content" : "chatbot_content"}`}>
      {!isFormActive ? (
        <div style={{ position: "relative" }}>
          <div className={"content-heading"}>
            <p className={`chat-heading ${isToggled ? "light" : ""}`}>
              Hi there
            </p>
            <p className={`chat-text ${isToggled ? "light" : ""}`}>
              This tab is for checking if the chatbot is perfectly trained.
            </p>
          </div>

          <div className={"conversations"}>
            {Array.isArray(conversationList) &&
              conversationList?.map((item, index) => (
                <SessionContainer
                  key={index}
                  item={item}
                  onClick={sessionOnClick}
                  isToggled={isToggled}
                />
              ))}
          </div>
          {Array.isArray(conversationList) && conversationList?.length ? (
            <>
              <div className={"session_box"}>
                <NewConversationBtn
                  className={"start_session"}
                  onClick={startSession}
                  isFormLoading={isFormLoading}
                  isConversationListLoading={isConversationListLoading}
                />
              </div>
            </>
          ) : (
            <div
              className={`no_session_box ${
                isFormLoading || isConversationListLoading
                  ? "adjust_loader"
                  : ""
              }`}
            >
              <NewConversationBtn
                className={"no_session"}
                onClick={startSession}
                isFormLoading={isFormLoading}
                isConversationListLoading={isConversationListLoading}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={"form-container"}>
            <div className={"form-header"}>
              <img
                src={GoBack}
                alt=""
                className={"go-back-icon"}
                onClick={goBack}
              />
              <p className={"form-instruction"}>
                Please provide your email address and phone number here in case
                the live chat gets disconnected.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={"form-body"}>
                <TransitionInput
                  label="Your Name"
                  required
                  value={values?.userName}
                  onChange={handleChange("userName")}
                  theme={isToggled}
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
                  theme={isToggled}
                  onChange={handleChange("email")}
                  error={touched?.email && errors?.email ? errors?.email : null}
                />
                <TransitionInput
                  label="Your Phone Number"
                  value={values.phone_number}
                  theme={isToggled}
                  onChange={handleChange("phone_number")}
                />
              </div>
              <div className={"form-footer"}>
                <button
                  type="submit"
                  disabled={isFormSubmitLoading}
                  className={"submit-button"}
                >
                  {isFormSubmitLoading ? (
                    <div className={"new-conversation-loader"}></div>
                  ) : (
                    <>
                      <img src={SendMsg} alt="" className={"send-icon"} />
                      <p className={"submit-text"}>New Chat</p>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
