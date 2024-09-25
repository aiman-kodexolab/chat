import React, { useEffect, useState } from "react";
import "./style.css";
import { replaceTags } from "../../../../utils/constant";
import NameImage from "../NameImage";
import moment from "moment";

function SessionContainer({ onClick, item, isToggled, name }) {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      onClick={() => onClick(item)}
      className={`session_container ${isToggled ? "light" : ""}`}
    >
      <div className={"item-container"}>
        <NameImage
          height={"40px"}
          width={"45px"}
          textSize="25px"
          rounded={true}
          firstName={item.user_name ? item.user_name[0]?.toUpperCase() : "?"}
        />
        <div className="name-wrapper">
          <div>
            <p className={`userName ${isToggled ? "light" : ""}`}>
              {name ? name : item?.email ? item?.email : item?.user_name}
            </p>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceTags(item?.first_message),
              }}
              className={`messages ${isToggled ? "light" : ""}`}
            />
          </div>

          <div className="elapsed-time">
            {moment(item?.created_on, "Do MMMM YYYY . h:mm A")
              .from(currentTime)
              .replace("minutes", "mins")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionContainer;
