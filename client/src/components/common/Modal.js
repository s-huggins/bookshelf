import React, { useEffect, useRef } from 'react';

const Modal = ({ children, handleClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const modalClickHandler = e => {
      const clickedInModal = modalRef.current.contains(e.target);
      if (!clickedInModal) {
        handleClose();
      }
    };

    document.addEventListener('click', modalClickHandler);

    return () => {
      document.removeEventListener('click', modalClickHandler);
    };
  }, []);

  return (
    <div className="Modal" ref={modalRef}>
      <div className="Modal__close-container">
        <span className="Modal__close-icon" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Modal;
