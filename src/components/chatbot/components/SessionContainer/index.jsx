import React from "react";
import "./style.css";
import { goAhead } from "../../../../assets";
import { replaceTags } from "../../../../utils/constant";
import NameImage from "../NameImage";

function SessionContainer({ onClick, userName, firstMessage, status }) {
  return (
    <div onClick={onClick} className="container">
      <h2 className="heading">Conversation</h2>
      <div className="itemContainer">
        <NameImage
          size="25px"
          textSize="12px"
          rounded={true}
          firstName={userName ? userName[0]?.toUpperCase() : "?"}
        />
        <div style={{ width: "70%" }}>
          <p className="userName">{userName}</p>
          <p
            dangerouslySetInnerHTML={{
              __html: replaceTags(firstMessage),
            }}
            className="message"
          />
        </div>
        <div>
          <p className="status">{status}</p>

          <img src={goAhead} alt="" className="image" />
        </div>
      </div>
    </div>
  );
}

export default SessionContainer;
