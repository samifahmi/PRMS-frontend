import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaTimes,
  FaUserMd,
  FaClipboardList
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is admin-related
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/user-management') ||
                      location.pathname.startsWith('/activity-log');

  useEffect(() => {
    if (!isAdminRoute) return;

    const handleMouseMove = (e) => {
      const threshold = 30; // pixels from left edge
      if (e.clientX <= threshold) {
        setIsVisible(true);
        setIsExpanded(true);
      } else if (e.clientX > 300 && isExpanded) {
        setIsExpanded(false);
      }
    };

    const handleMouseLeave = () => {
      setIsExpanded(false);
      setTimeout(() => {
        if (!isExpanded) {
          setIsVisible(false);
        }
      }, 300);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isAdminRoute, isExpanded]);

  const handleSidebarMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleSidebarMouseLeave = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsVisible(false);
  };

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/admin' },
    { icon: FaUsers, label: 'User Management', path: '/user-management' },
    { icon: FaUserMd, label: 'Doctors', path: '/admin/doctors' },
    { icon: FaCalendarAlt, label: 'Appointments', path: '/admin/appointments' },
    { icon: FaClipboardList, label: 'Activity Log', path: '/activity-log' },
    { icon: FaChartBar, label: 'Analytics', path: '/admin/analytics' },
    { icon: FaCog, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  if (!isAdminRoute) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="admin-sidebar"
          initial={{ x: -300 }}
          animate={{ x: isExpanded ? 0 : -250 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        >
          <div className="sidebar-header">
            <h3 className="sidebar-title">Admin Panel</h3>
            <button className="close-btn" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              </motion.div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminSidebar; 