import React from 'react';
import './ErrorModal.css'; // ErrorModal için CSS stillerini içeren dosyanın import edilmesi

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
}

export default ErrorModal;