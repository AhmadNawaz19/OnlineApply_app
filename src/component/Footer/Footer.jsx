import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <h3 className="footer-logo">Nawaz Technical</h3>
            <p className="brand-description">
              Empowering future developers through hands-on, practical, and beginner-friendly tech education in Python and full-stack web development.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/aboutUs">About Us</Link></li>
              <li><Link to="/course">Courses</Link></li>
            </ul>
          </div>

          {/* Offered Courses */}
          <div className="footer-col">
            <h4>Our Courses</h4>
            <ul>
              <li><Link to="/course">Web Development</Link></li>
              <li><Link to="/course">Python Programming</Link></li>
              <li><Link to="/course">Frontend Development</Link></li>
              <li><Link to="/course">Backend Logic</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              {/* <li>📍 Institute Campus, City Name</li> */}
              <li>📞 +92 330 1659292</li>
              <li>✉️ ahmadnawaz.codes@gmail.com</li>
              <li>⏱ Mon - Sat: 9:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Nawaz Technical. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;