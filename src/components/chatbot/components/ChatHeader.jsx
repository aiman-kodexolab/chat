import React from "react";
import "../style.css";
import { DeleteIcon, Widget, logo } from "../../../assets";
import { MdArrowBackIosNew } from "react-icons/md";
import { Toggle } from "./toggle/Toggle";

export default function ChatHeader({
  messagesSession = null,
  messageSessionBack = null,
  handleDeleteChat = null,
  isDisabled = false,
  chatLoad,
  handleToggle,
  isToggled,
  activeTab,
}) {
  return (
    <>
      {activeTab !== "home" ? (
        <>
          <div className="window_header">
            <div className="icon_header">
              <div>
                {messagesSession && (
                  <button
                    className="back"
                    disabled={chatLoad}
                    onClick={messageSessionBack}
                  >
                    <MdArrowBackIosNew
                      color={`${chatLoad ? "grey" : "white"}`}
                      size={20}
                    />
                  </button>
                )}

                <div className={`circle ${isToggled ? "light" : ""}`}>
                  <img src={Widget} alt="" />
                </div>
                {messagesSession && (
                  <div>
                    <img className="logo_wrapper" src={logo} alt="" />
                  </div>
                )}
                {activeTab === "form" && (
                  <div>
                    <div className="header-heading">Let's Chat!</div>
                  </div>
                )}
                {activeTab === "conversation" && (
                  <div>
                    <div className="header-heading">Conversation</div>
                  </div>
                )}
              </div>

              <div>
                <Toggle isToggled={isToggled} handleToggle={handleToggle} />
                {messagesSession && (
                  <button
                    disabled={isDisabled ? false : true}
                    className={"hamburger"}
                    onClick={handleDeleteChat}
                  >
                    <img
                      className={`${
                        isDisabled
                          ? `delete_chat_icon ${isToggled ? "light" : ""}`
                          : "grey_image"
                      }`}
                      src={DeleteIcon}
                      alt=""
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
          <hr className={"line_break"}></hr>
        </>
      ) : (
        <div className="toggle-wrapper">
          <Toggle isToggled={isToggled} handleToggle={handleToggle}></Toggle>
        </div>
      )}
    </>
  );
}
