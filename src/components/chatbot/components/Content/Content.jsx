import React from "react";
import NameImage from "../NameImage";
import "./style.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Content = ({
  title,
  firstName,
  logo,
  isToggled,
  textSize,
  height,
  width,
  heading,
  subHeading,
}) => {
  const customizedChatData = useSelector((state) => state.state.chatData);
  return (
    <div className="content-container">
      <div className="content-wrap">
        <NameImage
          height={height}
          width={width}
          textSize={textSize}
          rounded={true}
          firstName={firstName?.toUpperCase()}
          logo={logo}
          isToggled={isToggled}
        />
        {title ? (
          <div className={`title-wrapper ${isToggled ? "light" : ""}`}>
            {title}
          </div>
        ) : (
          <div className={`heading-wrapper ${isToggled ? "light" : ""}`}>
            {heading}
            <p className={`subheading-wrapper ${isToggled ? "light" : ""}`}>
              {subHeading}
            </p>
          </div>
        )}
      </div>

      <FaArrowRightLong
        color="white"
        size={12}
        className="right-arrow"
        style={{
          backgroundColor: customizedChatData?.theme_color || "#fb5521",
        }}
      />
    </div>
  );
};

export { Content };
