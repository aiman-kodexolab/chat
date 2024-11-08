import React, { useEffect, useState } from "react";
import "./style.css";
import { DeleteIcon, Widget, logo } from "../../../../assets";
import { MdArrowBackIosNew } from "../../../Icon";
import { Toggle } from "../../../common/Toggle";
import { useSelector } from "react-redux";
import { s3Url } from "../../../../utils/constant";

export default function ChatHeader({
  messagesSession = null,
  messageSessionBack = null,
  handleDeleteChat = null,
  isDisabled = false,
  isLoading,
  handleToggle,
  isToggled,
  activeTab,
}) {
  const customizedChatData = useSelector((state) => state.state.chatData);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (customizedChatData.avatar_picture) {
      const newImage = `${s3Url}/${customizedChatData.avatar_picture}`;
      setImage(newImage);
    }
  }, [customizedChatData]);

  return (
    <>
      {activeTab !== "home" ? (
        <>
          <div
            className="window_header"
            style={{
              backgroundColor: customizedChatData?.header_color || "#3e2248",
            }}
          >
            <div className="icon_header">
              <div>
                {messagesSession && (
                  <button
                    className="back"
                    disabled={isLoading}
                    onClick={messageSessionBack}
                  >
                    <MdArrowBackIosNew
                      color={`${isLoading ? "grey" : "white"}`}
                      size={20}
                    />
                  </button>
                )}

                <img
                  className={`circle ${isToggled ? "light" : ""}`}
                  src={image ? image : Widget}
                  alt=""
                />
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
                    disabled={isDisabled && !isLoading ? false : true}
                    className="hamburger"
                    onClick={handleDeleteChat}
                  >
                    <img
                      className={`${
                        isDisabled && !isLoading
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
          <hr className="line_break"></hr>
        </>
      ) : (
        <div className="toggle-wrapper">
          <Toggle isToggled={isToggled} handleToggle={handleToggle}></Toggle>
        </div>
      )}
    </>
  );
}
