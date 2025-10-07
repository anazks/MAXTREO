import React, { useState } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';
import './menu.css'
export default function NavBarMenu({ isVisible, onClose }) {
  return (
    <div className={`fixed-navbar-menu ${isVisible ? 'visible' : ''}`}>
      <div className="menu-header">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="menu-content">
        <h2>Menu</h2>
        <ul className="menu-list">
          <li><a href="/products">Products</a></li>
          <li><a href="/solutions">Solutions</a></li>
          <li><a href="/store">Store</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/about">About Us</a></li>
        </ul>
      </div>
    </div>
  );
}