import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Synth Labs</h1>
      <p>Craft your sonic universe. An intuitive, browser-based synthesizer playground.</p>
      {/* Add your cool visuals and graphics here */}
      <button onClick={() => navigate('/login')}>Start Composing</button>
    </div>
  );
};

export default LandingPage;
