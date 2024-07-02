import React from "react";
import "./style.css";

export default function TransitionInput({
  value,
  onChange,
  required,
  label,
  error,
}) {
  console.log("err", error);
  return (
    <div>
      <div
        className={`input-container ${error ? "border-red" : "border-default"}`}
      >
        <input
          type="text"
          id="input"
          className={`input-field ${error ? "text-red" : "text-white"}`}
          value={value}
          onChange={onChange}
        />
        <label
          htmlFor="input"
          className={`label ${error ? "text-red" : "text-default"}`}
        >
          {label} {required && <span className="text-seaGreen">*</span>}
        </label>
        <div className={`underline ${error ? "bg-red" : "bg-default"}`}></div>
      </div>
      {error && <p className="text-red text">{error}</p>}
    </div>
  );
}
