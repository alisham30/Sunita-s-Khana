import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Landing.css';

const Landing = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Login error:', error.message);
    }
    
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      setMessage('Account created successfully! You can now log in.');
      setActiveTab('login');
    } catch (error) {
      setError('Failed to create an account. ' + error.message);
      console.error('Signup error:', error.message);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (error) {
      setError('Failed to sign in with Google.');
      console.error('Google sign-in error:', error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="landing-container">
      <div className="landing-left">
        <div className="landing-content">
          <h1>Sunita's Khana</h1>
          <h2>Authentic Indian Cuisine</h2>
          <p>Experience the rich flavors of India with our authentic recipes and food delivery service.</p>
          <div className="features">
            <div className="feature">
              <i className="fas fa-utensils"></i>
              <span>Authentic Recipes</span>
            </div>
            <div className="feature">
              <i className="fas fa-truck"></i>
              <span>Fast Delivery</span>
            </div>
            <div className="feature">
              <i className="fas fa-star"></i>
              <span>Top Quality</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="landing-right">
        <div className="auth-container">
          <div className="auth-tabs">
            <button 
              className={activeTab === 'login' ? 'active' : ''} 
              onClick={() => handleTabChange('login')}
            >
              Login
            </button>
            <button 
              className={activeTab === 'signup' ? 'active' : ''} 
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}
          
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              
              <div className="auth-divider">
                <span>OR</span>
              </div>
              
              <button 
                type="button" 
                className="google-button" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <i className="fab fa-google"></i> Continue with Google
              </button>
              
              <p className="auth-footer">
                Don't have an account? <button type="button" onClick={() => handleTabChange('signup')}>Sign up</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              
              <div className="auth-divider">
                <span>OR</span>
              </div>
              
              <button 
                type="button" 
                className="google-button" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <i className="fab fa-google"></i> Continue with Google
              </button>
              
              <p className="auth-footer">
                Already have an account? <button type="button" onClick={() => handleTabChange('login')}>Login</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
