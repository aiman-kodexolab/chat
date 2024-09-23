import React, { useRef, useState } from "react";
import { VscSend } from "react-icons/vsc";
import "../style.css";

function InputField({
  style,
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
    if (textarea.value.length === 0) {
      setRows(1);
      return;
    }

    textarea.style.height = "auto";

    const computedStyle = window.getComputedStyle(textarea);
    const padding =
      parseInt(computedStyle.paddingTop, 10) +
      parseInt(computedStyle.paddingBottom, 10);
    const scrollHeight = textarea.scrollHeight - padding;
    const textareaRowHeight = textarea.offsetHeight / textarea.rows;
    const newRows = Math.ceil(scrollHeight / textareaRowHeight);
    setRows(newRows <= 3 ? newRows : 3);
    textarea.style.height = "";
  };
  return (
    <footer className={`footer-input-container ${isToggled ? "light" : ""}`}>
      <div
        style={style}
        className={`input-wrapper ${limit ? "limit-reached" : ""} ${className}`}
      >
        <form onSubmit={handleSubmit} className={"input-form"}>
          <textarea
            ref={inputRef}
            style={{ caretColor: "black" }}
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
          <button
            type="submit"
            disabled={disabled || !value?.trim()}
            className={"message-submit-button"}
          >
            <VscSend color="#FB5521" size={30} />
          </button>
        </form>
      </div>
      {/* <p className={`powered-by ${isToggled ? "light" : ""}`}>
        Powered by
        <span className={"ai-text"}> AI </span>
        <span className={"chatbot-text"}> Chatbot</span>
      </p> */}
      <div
        className={`char-counter ${isToggled ? "light" : ""} ${
          limit ? "text-limit" : ""
        }`}
      >
        {maxLength - (value?.length || 0)}/{maxLength}
      </div>
    </footer>
  );
}

export default InputField;
