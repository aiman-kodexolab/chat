import React from "react";
import "../style.css";
import { SendMsg, Widget } from "../../../assets";
import TransitionInput from "../../transitionInput/TransitionInput";
import { Card } from "./Card/Card";
import { Content } from "./Content/Content";

export default function ChatbotContent({
  values,
  isFormActive,
  errors,
  startSession,
  handleSubmit,
  handleChange,
  touched,
  conversationList,
  onSessionClick,
  isToggled,
  isFormSubmitLoading,
}) {
  return (
    <>
      <div className={`${isFormActive ? "form_content" : "chatbot_content"}`}>
        {!isFormActive ? (
          <div className="landing-page">
            <div className="content-wrapper">
              <div className={`circle-logo ${isToggled ? "light" : ""}`}>
                <img src={Widget} alt="" style={{ padding: 8 }} />
              </div>{" "}
              <p className="chat-with-us">Chat with Us</p>
              <p className="ask-help">You can count on us for help!</p>
            </div>

            <div className={`overlay-box ${isToggled ? "light" : ""}`}></div>
            <div className="conversations-box">
              <div className="conversations-inner-box">
                <Card isToggled={isToggled}>
                  <div onClick={startSession}>
                    <Content
                      logo={
                        <img
                          src={Widget}
                          alt=""
                          style={{ width: 30, height: 30 }}
                        />
                      }
                      isToggled={isToggled}
                      title={"Chat with us now"}
                      textSize="25px"
                      size="30px"
                    />
                  </div>
                </Card>
                {Array.isArray(conversationList) &&
                  conversationList?.length &&
                  conversationList?.slice(-2).map((item) => (
                    <Card isToggled={isToggled}>
                      <div onClick={() => onSessionClick(item)}>
                        <Content
                          heading={item?.email ?? item?.user_name}
                          subHeading={item?.first_message}
                          firstName={item?.user_name}
                          isToggled={isToggled}
                          textSize="25px"
                          size="30px"
                          onSessionClick={onSessionClick}
                        />
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="form-wrapper">
              <form onSubmit={handleSubmit} className="session-form">
                <div className="form-body">
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
                    error={
                      touched?.email && errors?.email ? errors?.email : null
                    }
                  />
                  <TransitionInput
                    label="Enter Your Phone Number"
                    value={values.phone_number}
                    theme={isToggled}
                    onChange={handleChange("phone_number")}
                    error={
                      touched?.phone_number && errors?.phone_number
                        ? errors?.phone_number
                        : null
                    }
                  />
                </div>
                <div className="form-footer">
                  <button
                    type="submit"
                    disabled={isFormSubmitLoading}
                    className="submit-button"
                  >
                    <p className="submit-text">Start Chat</p>
                    <img src={SendMsg} alt="" className="send-icon" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
