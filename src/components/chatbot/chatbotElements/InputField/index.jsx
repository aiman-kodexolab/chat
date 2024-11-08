import React, { useRef, useState } from "react";
import { VscSend, BsEmojiSmile } from "../../../Icon";
import EmojiPicker from "emoji-picker-react";
import "./style.css";
import { useSelector } from "react-redux";

function InputField({
  disabled,
  sendMessage,
  className = "",
  value,
  waitingMessage,
  setValue,
  theme,
  isToggled,
}) {
  const inputRef = useRef();
  const maxLength = 100;
  const [limit, setLimit] = useState(false);
  const [rows, setRows] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const customizedChatData = useSelector((state) => state.state.chatData);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue?.length <= maxLength) {
      setValue(inputValue);
      setLimit(false);
    } else {
      setLimit(true);
    }
    updateRows(e.target);
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text");
    const existingData = value || "";
    const newText = existingData + pasteData;
    setLimit(false);
    if (hasLineBreaks(pasteData)) {
      setRows(3);
    }
    if (newText.length > maxLength) {
      event.preventDefault();
      const truncatedText = newText.substring(0, maxLength);
      setValue(truncatedText);
      setLimit(true);
    } else {
      updateRows(event.target);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = (event) => {
    if (disabled) return;
    sendMessage(event);
    setRows(1);
    setLimit(false);
    inputRef.current.focus();
  };

  function hasLineBreaks(text) {
    const lineBreakPattern = /\r?\n/;
    return lineBreakPattern.test(text);
  }
  const updateRows = (textarea) => {
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxRows = 3;

    if (textarea.value.length === 0) {
      setRows(1);
    } else {
      const newRows = Math.min(Math.ceil(scrollHeight / 24), maxRows);
      setRows(newRows);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const newValue = value + emoji;
    inputRef.current.focus();
    if (newValue.length <= maxLength) {
      updateRows(inputRef.current);
      setValue(newValue);
      setLimit(false);
    } else {
      setLimit(true);
    }
    setShowEmojiPicker(false);
  };
  return (
    <footer className={`footer-input-container ${isToggled ? "light" : ""}`}>
      <div
        className={`input-wrapper ${limit ? "limit-reached" : ""} ${className}`}
      >
        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            ref={inputRef}
            className={`input-textarea ${theme && "theme"} ${
              limit ? "text-limit" : ""
            }`}
            placeholder={
              disabled ? waitingMessage : "Type your message here..."
            }
            value={value}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyPress}
            rows={rows}
            type="text"
          ></textarea>
          <BsEmojiSmile
            size={30}
            color="#636363"
            onClick={toggleEmojiPicker}
            className="emoji-icon"
          />
          <button
            type="submit"
            disabled={disabled || !value?.trim()}
            className={"message-submit-button"}
          >
            <VscSend
              color={customizedChatData?.theme_color || "#FB5521"}
              size={30}
            />
          </button>
        </form>
      </div>
      <div
        className={`char-counter ${isToggled ? "light" : ""} ${
          limit ? "text-limit" : ""
        }`}
      >
        {maxLength - (value?.length || 0)}/{maxLength}
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker-wrapper">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            height={320}
            width={300}
            skinTonesDisabled
            lazyLoadEmojis={true}
          />
        </div>
      )}
    </footer>
  );
}

export default InputField;
