import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import {getUserInfo} from '../Services/userApi'
const SECRET_KEY = "your_secret_key_123"; // Encryption key
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Function to decrypt token
  const getDecryptedToken = () => {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedToken || null; // Convert decrypted bytes to string
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };

  // Initialize state with decrypted token only on mount
  const [token, setToken_] = useState(() => getDecryptedToken());
  const [user, setUser] = useState(null); // User state
  // FIXED: Changed variable naming to follow camelCase convention consistently
  const [isAdmin, setIsAdmin] = useState(false);

  console.log(token, "Token in context");

  // Function to encrypt and store token
  const setToken = (newToken) => {
    if (newToken) {
      const encryptedToken = CryptoJS.AES.encrypt(newToken, SECRET_KEY).toString();
      localStorage.setItem("token", encryptedToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken_(newToken);
  };

  // Set axios authorization header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch user info when token is set
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          // Call an API to fetch the user data (you can replace this with your actual function)
          const response = await getUserInfo(); // Replace with the correct API endpoint
          console.log(response.data, "User data from API");
          setUser(response.data); // Set user data globally
        } catch (error) {
          console.error("Error fetching user info:", error);
          // Consider handling token expiration or invalid token here
          // If your backend returns appropriate status codes, you can check for 401/403
          // and clear the token if needed
        }
      }
    };

    fetchUserInfo();
  }, [token]); // Only fetch user info when the token changes

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser, // Expose setUser to update user state globally
      isAdmin,
      setIsAdmin // FIXED: changed from SetIsAdmin to setIsAdmin for consistency
    }),
    [token, user, isAdmin] // FIXED: Added isAdmin as a dependency
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;