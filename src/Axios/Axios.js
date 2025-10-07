import axios from "axios";
import BaseURL from '../Static/Static';
import CryptoJS from "crypto-js";

const SECRET_KEY = "your_secret_key_123";

// Create axios instance
const instance = axios.create({
  baseURL: BaseURL,
});

// Request interceptor to add token to all requests
instance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    try {
      const encryptedToken = localStorage.getItem("token");
      
      if (encryptedToken) {
        // Decrypt the token
        const decryptedToken = CryptoJS.AES.decrypt(
          encryptedToken, 
          SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        
        // Add token to headers if it exists
        if (decryptedToken) {
          config.headers.Authorization = `Bearer ${decryptedToken}`;
        }
      }
    } catch (error) {
      console.error("Error processing token for request:", error);
      // Continue with request even if token handling fails
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor to handle token errors (like expired tokens)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired or invalid tokens)
    if (error.response && error.response.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      
      // Redirect to login page or show notification
      // window.location.href = '/login';
      console.log("Token expired or invalid. Please login again.");
    }
    
    return Promise.reject(error);
  }
);

export default instance;