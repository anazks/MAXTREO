import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check credentials
    if (username === 'admin' && password === 'admin') {
      // Successful login - redirect to dashboard
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-containers">
      <div className="login-card">
        <div className="login-header">
          {/* <FaShip className="logo-icon" /> */}
          <h1>NEO TOKYO ADMIN</h1>
          <p>Admin Portal Login</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <FaUserShield className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              {showPassword ? (
                <FaEyeSlash 
                  className="input-icon password-toggle" 
                  onClick={() => setShowPassword(false)} 
                />
              ) : (
                <FaEye 
                  className="input-icon password-toggle" 
                  onClick={() => setShowPassword(true)} 
                />
              )}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-hint">
          <p>Default credentials: <strong>admin / admin</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;