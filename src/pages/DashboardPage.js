import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

const DashboardPage = () => {
  const [userExists, setUserExists] = useState(false);
  const [ username, setUsername ] = useState(''); 
  const navigate = useNavigate();
  const { walletAddress } = useWallet();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/checkUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ walletAddress: walletAddress })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setUserExists(data.userExists);
        console.log(data);
        setUsername(data.username);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = () => {
    // Perform sign out actions, e.g., disconnect wallet
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {userExists ? (
        <div>
          <p>Welcome back {username}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>User not found. Please sign in from the landing page.</p>
      )}
    </div>
  );
};

export default DashboardPage;
