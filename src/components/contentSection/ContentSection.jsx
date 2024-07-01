import React from "react";
import "./styles.css"

function ContentSection({ children, height, width, style }) {
  return (
    <div
      style={{
        width: width ? width : "49%",
        height: height,
        ...style,
      }}
      className="content-section"
    >
      {children}
    </div>
  );
}

export default ContentSection;
