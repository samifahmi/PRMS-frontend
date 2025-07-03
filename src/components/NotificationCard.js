import React from 'react';
import './NotificationCard.css';

const NotificationCard = ({ icon, title, message, type = 'info', onClick }) => {
  return (
    <div className={`notification-card notification-${type}`} onClick={onClick} role="alert" tabIndex={0}>
      {icon && <span className="notification-icon">{icon}</span>}
      <div className="notification-content">
        {title && <div className="notification-title">{title}</div>}
        <div className="notification-message">{message}</div>
      </div>
    </div>
  );
};

export default NotificationCard; 