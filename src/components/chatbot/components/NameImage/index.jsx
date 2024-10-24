import React from "react";
import { useSelector } from "react-redux";

function NameImage({
  firstName,
  lastName,
  rounded,
  height = "38px",
  width = "38px",
  textSize = "18px",
  style,
  logo,
  isToggled,
}) {
  const first = firstName?.charAt(0);
  const last = lastName?.charAt(0);
  const customizedChatData = useSelector((state) => state.state.chatData);
  return (
    <div
      style={{
        ...style,
        height: height,
        width: width,
        borderRadius: rounded ? "50px" : "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: customizedChatData?.header_color ? customizedChatData?.header_color :"#3E2248",
        boxShadow: "0px 4px 4px 0px #00000040",
      }}
    >
      {logo ? (
        <div className={`circle ${isToggled ? "light" : ""}`}>
          <img
            src={logo}
            alt=""
            className={`circle ${isToggled ? "light" : ""}`}
          />
        </div>
      ) : (
        <>
          <p
            className={"first_text"}
            style={{
              fontSize: textSize,
              color: "#ffffff",
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            {first}
          </p>
          {last && (
            <p
              className={"last_text"}
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
        </>
      )}
    </div>
  );
}

export default NameImage;
