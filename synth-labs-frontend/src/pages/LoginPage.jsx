import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      sessionStorage.setItem('accessToken', response.data.access);
      sessionStorage.setItem('refreshToken', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      // If login fails, try to register and then login again
      if (err.response && err.response.status === 401) {
        try {
          await registerUser({ username, password });
          const response = await loginUser({ username, password });
          sessionStorage.setItem('accessToken', response.data.access);
          sessionStorage.setItem('refreshToken', response.data.refresh);
          navigate('/dashboard');
        } catch (regErr) {
          setError('Registration failed. Please try a different username.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      {/* Add funky background graphics */}
      <form onSubmit={handleLogin}>
        <h2>Jump In</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Jump In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
