import React, { useState, useEffect } from 'react';

function Alert({ message = "Limited time offer! Gaming PC bundle with RTX 4080 now available!", type = "info", setAlertData }) {
  const [visible, setVisible] = useState(true); 
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`gaming-alert ${type}`}>
      <style>{`
        .gaming-alert {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6), 0 0 20px rgba(31, 255, 200, 0.4);
          font-family: 'Consolas', monospace;
          overflow: hidden;
          animation: slideIn 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 9999;
          background-color: #0a0e17;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f0f0f0;
        }

        .gaming-alert.success {
          background: linear-gradient(135deg, #002218, #0a0e17);
          border-left: 4px solid #00ff9d;
        }

        .gaming-alert.error {
          background: linear-gradient(135deg, #240010, #0a0e17);
          border-left: 4px solid #ff2a6d;
        }

        .gaming-alert.warning {
          background: linear-gradient(135deg, #2a1600, #0a0e17);
          border-left: 4px solid #ffb400;
        }

        .gaming-alert.info {
          background: linear-gradient(135deg, #001a2c, #0a0e17);
          border-left: 4px solid #05d9e8;
        }

        .alert-content {
          display: flex;
          padding: 16px;
          align-items: center;
        }

        .alert-icon {
          width: 28px;
          height: 28px;
          margin-right: 16px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 6px currentColor);
        }

        .alert-icon svg {
          width: 100%;
          height: 100%;
        }

        .alert-message {
          flex-grow: 1;
        }

        .alert-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
          text-shadow: 0 0 8px currentColor;
          line-height: 1.4;
        }

        .alert-subtitle {
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .close-button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 6px;
          margin-left: 8px;
          opacity: 0.7;
          transition: all 0.2s;
          border-radius: 50%;
        }

        .close-button:hover {
          opacity: 1;
          background-color: rgba(255, 255, 255, 0.15);
          transform: scale(1.1);
        }

        .progress-bar {
          position: relative;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .progress-bar-inner {
          position: absolute;
          height: 100%;
          width: 100%;
          animation: progress 5s linear forwards;
        }
        
        .success .progress-bar-inner {
          background-image: linear-gradient(90deg, #004d29, #00ff9d);
        }
        
        .error .progress-bar-inner {
          background-image: linear-gradient(90deg, #6e0020, #ff2a6d);
        }
        
        .warning .progress-bar-inner {
          background-image: linear-gradient(90deg, #5a3000, #ffb400);
        }
        
        .info .progress-bar-inner {
          background-image: linear-gradient(90deg, #003a5c, #05d9e8);
        }

        .top-border {
          height: 3px;
          box-shadow: 0 0 10px currentColor;
        }
        
        .success .top-border {
          background: linear-gradient(90deg, #00ff9d, #002218);
        }
        
        .error .top-border {
          background: linear-gradient(90deg, #ff2a6d, #240010);
        }
        
        .warning .top-border {
          background: linear-gradient(90deg, #ffb400, #2a1600);
        }
        
        .info .top-border {
          background: linear-gradient(90deg, #05d9e8, #001a2c);
        }

        @keyframes progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        @keyframes slideIn {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .success .alert-icon {
          color: #00ff9d;
        }
        .error .alert-icon {
          color: #ff2a6d;
        }
        .warning .alert-icon {
          color: #ffb400;
        }
        .info .alert-icon {
          color: #05d9e8;
        }
      `}</style>
      <div className={`top-border`}></div>
      <div className="alert-content">
        <div className="alert-icon">
          {type === "success" && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          {type === "error" && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          {type === "warning" && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          )}
          {type === "info" && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
        </div>

        <div className="alert-message">
          <div className="alert-title">{message}</div>
          <div className="alert-subtitle">AUTO-CLOSING IN 5s</div>
        </div>

        <button className="close-button" onClick={() => setVisible(false)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-inner"></div>
      </div>
    </div>
  );
}

export default Alert;