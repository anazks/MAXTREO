import React from "react";
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { googleAuth } from "../../../Services/userApi";
import { useAuth } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
const GoogleLoginComponent = ({ onLoginSuccess }) => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'error' or 'success'
  
  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Clear any previous alert messages
      setAlertMessage('');
      
      // credentialResponse.credential is the JWT token
      const token = credentialResponse.credential;
      const response = await googleAuth(token);
      
      // Handle the response from your backend
      const data = response.data;
      
      // Store tokens
      localStorage.setItem("refresh", data.refresh);
      setToken(data.access);
      
      // Show success message
      setAlertType('success');
      setAlertMessage('Login successful!');
      
      // If there's a callback function, call it
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
      
      // Navigate to home page
      navigate("/");
      
    } catch (error) {
      console.error("Error during Google authentication:", error);
      
      // Handle specific error cases
      if (error.response?.data?.is_active === false) {
        setAlertType('error');
        setAlertMessage("This account is inactive. Please contact administrator.");
      } else {
        setAlertType('error');
        setAlertMessage(error.response?.data?.error || "Authentication failed.This account is inactive Please contact administrator");
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Alert message */}
      {alertMessage && (
        <div 
          className={`mb-4 p-3 rounded text-center ${
            alertType === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-400' 
              : 'bg-green-100 text-green-700 border border-green-400'
          }`}
        >
          {alertMessage}
        </div>
      )}
      
      <GoogleOAuthProvider clientId="752728323430-85geretfsn5f7ino654hcqolnrm955c3.apps.googleusercontent.com">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              setAlertType('error');
              setAlertMessage("Google login failed. Please try again.");
            }}
            useOneTap
            shape="rectangular"
            text="continue_with"
            theme="filled_blue"
            size="large"
            width="100%"
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginComponent;