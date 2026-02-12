import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

interface UserState {
  username: string;
  password: string;
  email?: string;
}

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<UserState>({ username: '', password: '' });
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      const response = await axios.post(url, formData);
      
      if (isLogin) {
        setToken(response.data.token);
        alert('Logged in successfully!');
      } else {
        alert('Registered! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred');
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
    fontFamily: 'Arial, sans-serif'
  };

  const formStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '4rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '600px',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      {token ? (
        <div style={formStyle}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem' }}>Welcome!</h2>
          <p style={{ textAlign: 'center', wordBreak: 'break-all', fontSize: '1.1rem', lineHeight: '1.5' }}>
            Token: {token.substring(0, 20)}...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={{ textAlign: 'center', margin: 0, fontSize: '2.5rem', color: '#333' }}>
            {isLogin ? 'Login' : 'Register'}
          </h2>
          
          {!isLogin && (
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email || ''} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required
              style={inputStyle}
            />
          )}
          
          <input 
            type="text" 
            placeholder="Username" 
            value={formData.username} 
            onChange={e => setFormData({ ...formData, username: e.target.value })} 
            required 
            style={inputStyle}
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={e => setFormData({ ...formData, password: e.target.value })} 
            required 
            style={inputStyle}
          />
          
          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
          
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            style={linkButtonStyle}
          >
            Switch to {isLogin ? 'Register' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '1.2rem',
  width: '100%'
};

const buttonStyle: React.CSSProperties = {
  padding: '16px',
  backgroundColor: '#646cff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1.3rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px',
  transition: 'background 0.3s'
};

const linkButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#646cff',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '1.1rem',
  marginTop: '20px',
  alignSelf: 'center'
};