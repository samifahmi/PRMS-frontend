import React from 'react';
import { motion } from 'framer-motion';
import '../styles/main.css';
import aboutImg from '../assets/about-hero.jpg'; // Add this image to src/assets

const About = () => {
  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}
    >
      <img 
        src={aboutImg} 
        alt="About our hospital system" 
        style={{ maxWidth: '400px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
      />
      <div style={{ flex: 1 }}>
        <h1 style={{ color: '#007bff', marginBottom: '1rem' }}>About Us</h1>
        <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>
          We are dedicated to providing a secure, efficient, and user-friendly Patient Record Management System for modern healthcare environments. Our platform empowers hospitals, doctors, staff, and patients to manage health records with confidence and ease.
        </p>
        <ul style={{ fontSize: '1.1rem', color: '#444', marginBottom: '1.5rem' }}>
          <li>Modern, minimalist, and accessible design</li>
          <li>Role-based dashboards for all users</li>
          <li>Advanced security and privacy features</li>
          <li>Comprehensive appointment and record management</li>
        </ul>
        <p style={{ color: '#007bff', fontWeight: 'bold' }}>
          Our mission: To advance healthcare through technology and design.
        </p>
      </div>
    </motion.div>
  );
};

export default About; 