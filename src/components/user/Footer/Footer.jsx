import React from "react";
import "./footer.css";
import { FaWhatsapp, FaFacebook, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

function NeoFooter() {
  return (
    <div className="neo-simple-footer">
      <div className="neo-footer-content">
        
        {/* Logo and Description */}
        <div className="neo-footer-section">
          <div className="neo-footer-logo">
            <h2>NEO TOKYO</h2>
            <p>Building Gaming Experiences Since 2020</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="neo-footer-section">
          <h3>Quick Links</h3>
          <div className="neo-footer-links">
            <a href="/about">About</a>
            <a href="/products">Products</a>
            <a href="/support">Support</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        {/* Categories */}
        <div className="neo-footer-section">
          <h3>Categories</h3>
          <div className="neo-footer-links">
            <a href="/gaming-pcs">Gaming PCs</a>
            <a href="/peripherals">Peripherals</a>
            <a href="/accessories">Accessories</a>
            <a href="/workstations">Workstations</a>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="neo-footer-section">
          <h3>Connect With Us</h3>
          
          <div className="neo-contact-info">
            <div className="neo-contact-item">
              <FaMapMarkerAlt className="neo-contact-icon" />
              <span>Kochi, Kerala</span>
            </div>
          </div>

          <div className="neo-social-links">
            <a href="https://wa.me/917920938981" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="neo-social-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="neo-social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="neo-social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="neo-footer-bottom">
        <div className="neo-footer-bottom-content">
          <p>&copy; 2025 Neo Tokyo. All rights reserved.</p>
          <div className="neo-legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/returns">Returns</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeoFooter;