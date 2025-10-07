import React, { useEffect, useState } from 'react';
import { CheckCircle, Package } from 'lucide-react';

function PaymentDone() {
  const [show, setShow] =useState(true);

  const handleClose = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Payment Successful!</h2>
          <button className="close-button" onClick={handleClose}>✕</button>
        </div>
        
        {/* Animation container */}
        <div className="animation-container">
          {/* Road */}
          <div className="road"></div>
          
          {/* Delivery van */}
          <div className="delivery-van">
            <div className="van-body">
              <div className="van-cab"></div>
              <div className="van-window"></div>
              <div className="van-door-left"></div>
              <div className="van-door-right"></div>
              <div className="wheel wheel-front"></div>
              <div className="wheel wheel-back"></div>
              <div className="van-logo">EXPRESS</div>
              <div className="package">
                <Package size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          {/* Success check */}
          <div className="check-animation">
            <CheckCircle size={80} strokeWidth={2} />
          </div>
        </div>
        
        {/* Content */}
        <div className="modal-content">
          <p className="success-message">
            Thank you for your purchase! Your product is on the way.
          </p>
          
          <div className="order-details">
            <div className="order-header">
              <span className="order-number">Order #237589</span>
              <span className="order-date">Today</span>
            </div>
            
            <div className="delivery-info">
              <Package size={16} />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
          </div>
          
          <button className="track-button">
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}
// Add this CSS to your stylesheet
const styles = `
  .payment-success-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .payment-success-modal {
    width: 100%;
    max-width: 400px;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid #333;
  }

  .modal-header {
    position: relative;
    padding: 24px;
    text-align: center;
    border-bottom: 1px solid #333;
  }

  .modal-header h2 {
    margin: 0;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #666;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;
  }

  .close-button:hover {
    color: #fff;
  }

  .animation-container {
    position: relative;
    height: 180px;
    background-color: #000;
    overflow: hidden;
  }

  .road {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #444;
  }

  .delivery-van {
    position: absolute;
    bottom: 50px;
    left: -140px;
    animation: van-movement 6s forwards;
  }

  .van-body {
    position: relative;
    width: 120px;
    height: 50px;
    background-color: #000;
    border: 1px solid #333;
    border-radius: 4px;
  }

  .van-cab {
    position: absolute;
    left: -30px;
    bottom: 0;
    width: 40px;
    height: 40px;
    background-color: #000;
    border: 1px solid #333;
    border-radius: 4px 0 0 4px;
  }

  .van-window {
    position: absolute;
    left: -25px;
    bottom: 25px;
    width: 25px;
    height: 12px;
    background-color: #111;
    border: 1px solid rgba(231, 1, 60, 1);
    border-radius: 2px;
  }

  .van-door-left {
    position: absolute;
    right: 30px;
    top: 0;
    width: 2px;
    height: 50px;
    background-color: #333;
    animation: door-open 6s forwards;
  }

  .van-door-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 50px;
    background-color: #000;
    border-left: 1px solid #333;
    transform-origin: right;
    animation: door-swing 6s forwards;
  }

  .wheel {
    position: absolute;
    bottom: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #111;
    border: 3px solid rgba(231, 1, 60, 1);
    animation: wheel-spin 1s linear infinite;
  }

  .wheel-front {
    left: 15px;
  }

  .wheel-back {
    right: 25px;
  }

  .van-logo {
    position: absolute;
    top: 5px;
    left: 10px;
    color: rgba(231, 1, 60, 1);
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 1px;
  }

  .package {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: rgba(231, 1, 60, 1);
    opacity: 0;
    animation: package-appear 6s forwards;
  }

  .check-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    color: rgba(231, 1, 60, 1);
    opacity: 0;
    animation: check-appear 6s forwards;
  }

  .modal-content {
    padding: 24px;
  }

  .success-message {
    text-align: center;
    color: #ddd;
    margin-bottom: 20px;
  }

  .order-details {
    padding: 16px;
    background-color: #111;
    border-radius: 8px;
    border: 1px solid #333;
    margin-bottom: 20px;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .order-number {
    font-weight: bold;
    color: #fff;
  }

  .order-date {
    color: #666;
    font-size: 14px;
  }

  .delivery-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #999;
    font-size: 14px;
  }

  .delivery-info svg {
    color: rgba(231, 1, 60, 1);
  }

  .track-button {
    width: 100%;
    padding: 12px;
    background-color: rgba(231, 1, 60, 1);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .track-button:hover {
    background-color: rgba(200, 0, 50, 1);
  }

  @keyframes van-movement {
    0% { left: -140px; }
    20% { left: calc(50% - 60px); }
    70% { left: calc(50% - 60px); }
    100% { left: 100%; }
  }

  @keyframes wheel-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes door-swing {
    0%, 30%, 60%, 100% { transform: rotateY(0); }
    35%, 55% { transform: rotateY(-120deg); }
  }

  @keyframes door-open {
    0%, 30%, 60%, 100% { opacity: 1; }
    35%, 55% { opacity: 0; }
  }

  @keyframes package-appear {
    0%, 35%, 55%, 100% { opacity: 0; }
    40%, 50% { opacity: 1; }
  }

  @keyframes check-appear {
    0%, 70% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    75%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    90%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;
export default  PaymentDone
