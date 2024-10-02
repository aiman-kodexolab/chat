import React from "react";
import "./style.css";

export default function TransitionInput({
  value,
  onChange,
  required,
  label,
  error,
  theme,
}) {
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
          {label} {required && <span className={"text-seaGreen"}>*</span>}
        </label>
        <input
          type="text"
          id="input"
          className={`input-field ${theme ? "theme" : ""} ${
            error ? "text-red" : "text-white"
          } ${error && theme ? "text-red" : "text-[#141718]"}`}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <p className={"text-red text"}>{error}</p>}
    </div>
  );
}
