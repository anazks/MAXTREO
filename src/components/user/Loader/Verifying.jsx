import React from 'react'
import './Verifying.css'

function Verifying({ verificstion }) {
  return (
    <div className="verifying-container">
      <div className="verifying-card">
        {verificstion === undefined ? (
          // Loading/Verifying state (initial state)
          <>
            <div className="spinner"></div>
            <h1 className="verifying-title">Verifying OTP<span className="dots"></span></h1>
            <p className="verifying-text">Please wait while we confirm your code</p>
          </>
        ) : verificstion === true ? (
          // Success state
          <div className="result-animation success">
            <div className="checkmark-circle">
              <div className="checkmark draw"></div>
            </div>
            <h1 className="success-title">Verified Successfully</h1>
            <p className="success-text">You will be redirected shortly</p>
          </div>
        ) : (
          // Error state
          <div className="result-animation error">
            <div className="error-circle">
              <div className="error-icon">✕</div>
            </div>
            <h1 className="error-title">Invalid OTP</h1>
            <p className="error-text">Please try again with correct code</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Verifying