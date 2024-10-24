import React from "react";
import "./style.css";
import { useSelector } from "react-redux";

export default function TransitionInput({
  value,
  onChange,
  required,
  label,
  error,
  theme,
}) {
  const customizedChatData = useSelector((state) => state.state.chatData);
  return (
    <div>
      <div
        className={`input-container  ${
          error ? "border-red" : "border-default"
        }`}
      >
        <label
          htmlFor="input"
          className={`label ${error ? "text-red" : "text-default"}`}
          style={{ color: theme ? "#3E2248" : "white" }}
        >
          {label}{" "}
          {required && (
            <span
              className={"text-seaGreen"}
              style={{
                backgroundColor: customizedChatData?.theme_color || "#fb5521",
              }}
            >
              *
            </span>
          )}
        </label>
        <input
          type="text"
          id="input"
          className={`input-field ${theme ? "theme" : ""} ${
            error ? "text-red" : "text-white"
          } ${error && theme ? "text-red" : "text-[#141718]"}`}
          value={value}
          onChange={onChange}
          style={{
            borderColor: customizedChatData?.theme_color || "#fb5521",
          }}
        />
      </div>
      {error && <p className={"text-red text"}>{error}</p>}
    </div>
  );
}
