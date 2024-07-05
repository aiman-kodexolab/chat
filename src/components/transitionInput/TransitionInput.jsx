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
  console.log("err", error);
  return (
    <div>
      <div
        className={`input-container  ${
          error ? "border-red" : "border-default"
        }`}
      >
        <input
          type="text"
          style={{ caretColor: theme ? '#141718' : "white" }}
          id="input"
          className={`input-field ${theme && "theme"} ${
            error ? "text-red" : "text-white"
          } ${error && theme ? "text-red" : "text-[#141718]"}`}
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
