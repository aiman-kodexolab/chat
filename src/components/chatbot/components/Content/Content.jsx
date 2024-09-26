import React from "react";
import NameImage from "../NameImage";
import "./style.css";
import { FaArrowRightLong } from "react-icons/fa6";

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

      <FaArrowRightLong color="white" size={12} className="right-arrow" />
    </div>
  );
};

export { Content };
