import React from "react";
import "./style.css";
import { goAhead } from "../../../../assets";
import { replaceTags } from "../../../../utils/constant";
import NameImage from "../NameImage";

function SessionContainer({ onClick, item, isToggled }) {
  return (
    <div
      onClick={() => onClick(item)}
      className={`session_container ${isToggled ? "light" : ""}`}
    >
      <h2 className={`heading ${isToggled ? "light" : ""}`}>Conversation</h2>
      <div className="itemContainer">
        <NameImage
          size="25px"
          textSize="12px"
          rounded={true}
          firstName={item.user_name ? item.user_name[0]?.toUpperCase() : "?"}
        />
        <div style={{ width: "70%" }}>
          <p className="userName">{item.user_name}</p>
          <p
            dangerouslySetInnerHTML={{
              __html: replaceTags(item?.first_message),
            }}
            className="messages"
          />
        </div>
        <div>
          <p className="status">{item?.status}</p>

          <img src={goAhead} alt="" className="image" />
        </div>
      </div>
    </div>
  );
}

export default SessionContainer;
