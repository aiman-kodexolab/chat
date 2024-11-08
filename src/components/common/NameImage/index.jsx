import React from "react";
import "./style.css";

function NameImage({ firstName, height, width, style, logo, isToggled }) {
  return (
    <div
      className="name-image-wrapper"
      style={{
        ...style,
        height: height,
        width: width,
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className={`circle ${isToggled ? "light" : ""}`}
        />
      ) : (
        <p className="initial">{firstName}</p>
      )}
    </div>
  );
}

export default NameImage;
