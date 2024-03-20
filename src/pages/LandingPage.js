import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage({ userInfo }) {
  const [username, setUsername] = useState('');
  const [isEligible, setIsEligible] = useState(null);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.wallet_address && userInfo.username) {
      navigate('/dashboard');
    }
  }, [userInfo]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('Checking eligibility for', username);
      console.log("process.env.REACT_APP_SERVER_BASE_URL", process.env.REACT_APP_SERVER_BASE_URL)
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/checkEligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lichessHandle: username })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setIsEligible(data.isEligible);
      setReason(data.reason);
      if (data.isEligible) {
        // Pass the username as a parameter when navigating to the onboarding page
        navigate(`/onboarding/${username}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Landing Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your Lichess username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <button type="submit">Check Eligibility</button>
      </form>
      {isEligible !== null && (
        <p>{isEligible ? 'You are eligible to join' :
          `You are not eligible to join because: ${reason}`
        }</p>
      )}
    </div>
  );
}

export default LandingPage;
