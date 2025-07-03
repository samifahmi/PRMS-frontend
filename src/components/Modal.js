import React from 'react';
import '../styles/main.css';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal">
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        {children}
        <button className="button button-secondary" style={{ marginTop: '1.5rem' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal; 