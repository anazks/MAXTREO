// OtpInput.jsx
import React, { useEffect, useState, useRef } from "react";
import { verifyOtp } from "../../../Services/userApi";
import { useAuth } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Varifying from '../Loader/Verifying';
import { IoArrowForwardCircleSharp, IoArrowBackCircleSharp } from 'react-icons/io5';

const OtpInput = ({ email: propEmail }) => {
  const { setToken, setIsAdmin, isAdmin } = useAuth();
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [verificstion, setVerifiction] = useState(undefined);
  const navigate = useNavigate();
  
  // Use email from props if available, otherwise from localStorage
  const email = propEmail || localStorage.getItem("email");
  
  useEffect(() => {
    if (!email) {
      // Redirect if no email is available
      navigate('/login');
    }
    
    // Initialize the refs array
    inputRefs.current = inputRefs.current.slice(0, 6);
    
    // Focus on the first input initially
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate]);
  
  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Allow only one digit per input
    if (/^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value.slice(-1); // Only take the last character entered
      setOtpValues(newOtpValues);
      
      // Move to next input if a digit was entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        // If current field is empty and backspace is pressed, go to previous field
        inputRefs.current[index - 1].focus();
      }
    }
    // Handle left arrow key
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Handle right arrow key
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    // Handle Enter key
    else if (e.key === 'Enter') {
      handleSubmitOTP();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is digits only
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split('');
      const newOtpValues = [...otpValues];
      
      // Fill in the values
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtpValues[index] = digit;
        }
      });
      
      setOtpValues(newOtpValues);
      
      // Focus on the next empty field or the last field
      const nextEmptyIndex = newOtpValues.findIndex(val => !val);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex].focus();
      } else if (digits.length < 6) {
        inputRefs.current[digits.length].focus();
      } else {
        inputRefs.current[5].focus();
      }
    }
  };
  
  const handleSubmitOTP = async () => {
    const otp = otpValues.join('');
    
    if (!otp || otp.length < 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    setVerifiction(undefined);
    
    try {
      // Make API request to verify OTP
      const isVerified = await verifyOtp(email, otp, setToken, setIsAdmin, isAdmin);
      
      if (isVerified.data === true) {
        // Success case
        setVerifiction(true);
        
        // Wait to show the success animation before redirecting
        setTimeout(() => {
          localStorage.removeItem("email");
          setIsAdmin(isVerified.admin);
          navigate(isVerified.admin === true ? '/admin/dashboard' : '/');
        }, 2000);
      } else {
        // Failed verification
        setVerifiction(false);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error(
        "❌ Error verifying OTP:",
        error.response?.data || error.message
      );
      
      // API error = failed verification
      setVerifiction(false);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Varifying verificstion={verificstion} />
        </div>
      )}
      
      <div className="w-full text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Code</h2>
        <p className="text-gray-600">
          We've sent a verification code to
          <span className="font-medium text-blue-600 block mt-1">{email}</span>
        </p>
      </div>
      
      <div className="flex justify-center gap-2 w-full mb-6">
        {otpValues.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
            style={{ backgroundColor: "rgba(217, 217, 217, 1)" }}
            disabled={loading}
            required
          />
        ))}
      </div>
      
      <button 
        className={`w-full bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors ${
          loading || otpValues.join('').length < 6 ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        onClick={handleSubmitOTP}
        disabled={loading || otpValues.join('').length < 6}
      >
        <span className="mr-2">{loading ? 'Verifying...' : 'Submit OTP'}</span>
        <IoArrowForwardCircleSharp className="text-xl" />
      </button>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Didn't receive a code? <button className="text-blue-600 font-medium hover:text-blue-800">Resend OTP</button>
        </p>
      </div>
    </div>
  );
};

export default OtpInput;