import React from "react";
import "./style.css";

const Button = ({ onClick, isLoading, className, style, type, children }) => {
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={isLoading}
      style={style}
    >
      {isLoading ? <div className="submit-loader"></div> : children}
    </button>
  );
};

export default Button;
