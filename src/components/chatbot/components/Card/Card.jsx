import React from "react";
import "./style.css";

const Card = ({ isToggled, children }) => {
  console.log(children);
  return (
    <div className={`card-wrapper ${isToggled ? "light" : ""}`}>{children}</div>
  );
};

export { Card };
