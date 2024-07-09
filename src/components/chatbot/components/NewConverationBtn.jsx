import React from 'react';
import { SendMsg } from '../../../assets';
import "../style.css";

const NewConversationBtn = ({ onClick, isLoading, buttonSize, className, style }) => (
    <button
      className={`${className}`}
      onClick={onClick}
      disabled={isLoading}
      style={style}
    >
      {/* {isLoading ? ( */}
        {/* // <Spinner height={buttonSize === 'large' ? "30" : "23"} color="#FFFFFF" /> */}
      {/* ) : ( */}
        <>
          <img src={SendMsg} alt="" className="send-msg-icon" style={{width: '15px', height: '15px'}} />
          <p className="new-conversation-text">
            New Conversation
          </p>
        </>
      {/* )} */}
    </button>
  );
  
  export default NewConversationBtn;