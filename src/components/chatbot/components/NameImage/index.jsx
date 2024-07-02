import React from "react";

function NameImage({
  firstName,
  lastName,
  rounded,
  size = "38px",
  textSize = "18px",
  style,
}) {
  const first = firstName?.charAt(0);

  const last = lastName?.charAt(0);
  return (
    <div
      style={{
        ...style,
        height: size,
        width: size,
        borderRadius: rounded ? "50px" : "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(90.57deg,#079485 9.91%, #0c7586 50.24%, #115588 91.56%)",
      }}
    >
      <p
      className="first_text"
        style={{
          fontSize: textSize,
          color: "#ffffff",
          fontFamily: "sans-serif",
          fontWeight: 500,
        }}
      >
        {first}
      </p>
      {last && (
        <p
        className="last_text"
          style={{
            fontSize: textSize,
            color: "#ffffff",
            fontFamily: "sans-serif",
            fontWeight: 500,
            marginLeft: "2px",
          }}
        >
          {last}
        </p>
      )}
    </div>
  );
}

export default NameImage;
