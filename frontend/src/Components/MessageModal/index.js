import React from "react";
import "./index.css";

const MessageModal = ({ messageType, message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal ${messageType === "error" ? "error" : "success"}`}>
        <h2>{messageType === "error" ? "Error" : "Success"}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MessageModal;
