import React, { useRef, useState } from "react";
import { Send } from "../../../assets";
import "../style.css";

function InputField({
  style,
  disabled,
  sendMessage,
  className,
  value,
  waitingMessage,
  text,
  setValue,
  rows,
  maxLength,
  limit,
  handleInputChange,
  handlePaste,
  handleKeyPress,
  handleSubmitMessage,
  hasLineBreaks,
  updateRows,
  inputRef
}) {
//   const inputRef = useRef();
//   const maxLength = 100;
//   const [limit, setLimit] = useState(false);
//   const [rows, setRows] = useState(1);

//   const handleInputChange = (e) => {
//     const inputValue = e.target.value;
//     if (!text) {
//       if (inputValue?.length <= maxLength) {
//         setValue(inputValue);
//         setLimit(false);
//       } else {
//         setLimit(true);
//       }
//     } else {
//       setValue(inputValue);
//     }
//     updateRows(e.target);
//   };

//   const handlePaste = (event) => {
//     const pasteData = event.clipboardData.getData("text");
//     const existingData = value || "";
//     const newText = existingData + pasteData;
//     setLimit(false);
//     if (hasLineBreaks(pasteData)) {
//       setRows(3);
//     }
//     if (newText.length > maxLength) {
//       event.preventDefault();
//       const truncatedText = newText.substring(0, maxLength);
//       setValue(truncatedText);
//       setLimit(true);
//     } else {
//       updateRows({ value: newText });
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSubmitMessage(event);
//     }
//   };

//   const handleSubmitMessage = (event) => {
//     sendMessage(event);
//     setRows(1);
//     setLimit(false);
//   };

//   function hasLineBreaks(text) {
//     const lineBreakPattern = /\r?\n/;
//     return lineBreakPattern.test(text);
//   }

//   const updateRows = (textarea) => {
//     if (textarea.value.length === 0) {
//       setRows(1);
//       return;
//     }
//     textarea.style.height = "auto";
//     const rowHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
//     const newRows = Math.floor(textarea.scrollHeight / rowHeight);
//     setRows(newRows <= 3 ? newRows : 3);
//     textarea.style.height = "";
//   };

  return (
    <div className="input-container">
      <div style={style} className={`input-wrapper ${limit ? "limit-reached" : ""} ${className}`}>
        <form onSubmit={handleSubmitMessage} className="input-form">
          <textarea
            ref={inputRef}
            className={`input-textarea ${limit ? "text-limit" : ""}`}
            placeholder={disabled ? waitingMessage : "Type a message"}
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            onPaste={text ? undefined : handlePaste}
            onKeyDown={handleKeyPress}
            rows={rows}
            type="text"
          ></textarea>
          <button
            type="submit"
            // disabled={disabled || !value?.trim()}
            className="message-submit-button"
          >
            <img src={Send} alt="" className="message-send-icon" />
          </button>
        </form>
      </div>
      {text ? (
        <p className="powered-by">
          Powered by
          <span className="ai-text"> AI </span>
          <span className="chatbot-text"> Chatbot</span>
        </p>
      ) : (
        <div className={`char-counter ${limit ? "text-limit" : ""}`}>
          {maxLength - (value?.length || 0)}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default InputField;
