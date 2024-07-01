import React from "react";
import "./style.css";

export default function TransitionInput({
  value,
  onChange,
  required,
  label,
  error,
}) {
  console.log("ersr", error);
  return (
    <div
      className={`input-container ${error ? "border-red" : "border-default"}`}
    >
      <input
        type="text"
        id="input"
        className={`input-field ${
          error ? "text-red placeholder-red" : "text-white"
        }`}
        value={value}
        onChange={onChange}
        placeholder={error && error}
      />
      <label
        htmlFor="input"
        className={`label ${error ? "text-red" : "text-default"}`}
      >
        {label} {required && <span className="text-seaGreen">*</span>}
      </label>
      <div className={`underline ${error ? "bg-red" : "bg-default"}`}></div>
    </div>
  );
}
