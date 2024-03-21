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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">welcome to cheth</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">enter your lichess username:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Check Eligibility
          </button>
        </form>
        {isEligible !== null && (
          <p className="text-sm mt-4">
            {isEligible ? 'You are eligible to join' :
              `You are not eligible to join because: ${reason}`
            }
          </p>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
