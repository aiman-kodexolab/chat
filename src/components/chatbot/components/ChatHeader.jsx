import React from "react";
import "../style.css";
import { DeleteIcon, GoBack, Hamburger, Widget } from "../../../assets";

export default function ChatHeader({ messagesSession, messageSessionBack, handleDeleteChat }) {
  return (
    <>
      <div className="window_header">
        {/* rnkfnrklfnomrnforfj ornfirf ornfirf oirfirfn */}
        <div className="icon_header">
          <div className="back" onClick={messageSessionBack}>
            {messagesSession && <img className="go-back-icon" src={GoBack} />}
          </div>

          <div>
            {messagesSession && (
              <button disabled={true} className="hamburger" onClick={handleDeleteChat}>
                <img className="hamburger_icon" src={DeleteIcon} />
              </button>
            )}
            <div className="toggle">
              <img className="toggle_icon" src={Hamburger} />
            </div>
          </div>
        </div>
      </div>
      <hr className="line_break"></hr>
    </>
  );
}
