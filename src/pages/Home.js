import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../assets/photo_2024-07-19_11-40-39.jpg';
import heroImg from '../assets/full-equiped-medical-cabinet.jpg';
import img1 from '../assets/young_african_american_man_guy_visiting_dentist_s_office_prevention.jpg';
import img2 from '../assets/african_american_man_patient_dental_chair_dentist_office_doctor.jpg';
import img3 from '../assets/happy-afro-kid-regular-check-up-teeth-dental-clinic.jpg';
// import aboutImg from '../assets/about-hero.jpg';
import './Home.css';

const services = [
  {
    icon: <img src={img1} alt="General Dentistry" className="service-img" />, 
    title: 'General Dentistry',
    desc: 'Comprehensive dental care including cleanings, fillings, and preventive treatments for the whole family.'
  },
  {
    icon: <img src={img2} alt="Cosmetic Dentistry" className="service-img" />, 
    title: 'Cosmetic Dentistry',
    desc: 'Transform your smile with whitening, veneers, and other aesthetic dental procedures.'
  },
  {
    icon: <img src={img3} alt="Preventive Care" className="service-img" />, 
    title: 'Preventive Care',
    desc: 'Stay ahead of dental problems with regular checkups and professional cleanings.'
  },
  {
    icon: '💙',
    title: 'Emergency Care',
    desc: 'Urgent dental care when you need it most, providing relief from dental pain and trauma.'
  }
];

const practiceInfo = [
  {
    icon: '⏰',
    title: 'Hours',
    desc: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 3:00 PM\nSun: Closed'
  },
  {
    icon: '📍',
    title: 'Location',
    desc: '123 Medical Plaza\nDowntown District\nCity, State 12345'
  },
  {
    icon: '📞',
    title: 'Contact',
    desc: 'Phone: (555) 123-4567\nEmail: info@drseidnur.com\nEmergency: (555) 911-HELP'
  }
];

const Home = () => (
  <>
    {/* Header */}
    <header className="main-header">
      <div className="header-content">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="header-logo-img" />
          <span className="header-title">Dr. Seid Nur</span>
        </div>
        <nav>
          <Link to="/login"><Button variant="secondary" style={{ minWidth: 70 }}>Login</Button></Link>
        </nav>
      </div>
    </header>

    {/* Hero Section */}
    <section className="hero-section hero-img-bg" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero-content">
        <h1 className="hero-headline">Creating Smiles that Last a Lifetime</h1>
        <p className="hero-subheadline">Experience exceptional dental care with Dr. Seid Nur and our dedicated team. We're committed to your oral health and beautiful smile.</p>
      </div>
    </section>

    {/* Services Cards */}
    <section className="services-section">
      <h2 className="services-title">Our Services</h2>
      <p className="services-desc">We offer comprehensive dental services to keep your smile healthy and beautiful</p>
      <div className="services-cards">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <div className="service-icon">{s.icon}</div>
            <div className="service-title">{s.title}</div>
            <div className="service-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Practice Info */}
    <section className="practice-section">
      <h2 className="practice-title">Visit Our Practice</h2>
      <p className="practice-desc">We're here to serve you with convenient hours and location</p>
      <div className="practice-cards">
        {practiceInfo.map((p, i) => (
          <div className="practice-card" key={i}>
            <div className="practice-icon">{p.icon}</div>
            <div className="practice-title">{p.title}</div>
            <div className="practice-desc">{p.desc.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}</div>
          </div>
        ))}
      </div>
    </section>

    {/* About Us Section (from About.js) */}
    <section className="about-section">
      <img 
        src={img1} 
        alt="About our clinic" 
      />
      <div style={{ flex: 1 }}>
        <h1>About Us</h1>
        <p>
          We are dedicated to providing a secure, efficient, and user-friendly Patient Record Management System for modern healthcare environments. Our platform empowers hospitals, doctors, staff, and patients to manage health records with confidence and ease.
        </p>
        <ul>
          <li>Modern, minimalist, and accessible design</li>
          <li>Role-based dashboards for all users</li>
          <li>Advanced security and privacy features</li>
          <li>Comprehensive appointment and record management</li>
        </ul>
        <p className="about-mission">
          Our mission: To advance healthcare through technology and design.
        </p>
      </div>
    </section>
  </>
);

export default Home;