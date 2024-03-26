import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

function LandingPage({ userInfo }) {
  const [username, setUsername] = useState('');
  const [isEligible, setIsEligible] = useState(null);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme

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
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/checkEligibility`, {
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
    <Container maxWidth="md" sx={{ py: 8 }}>
      <div className={`min-h-screen flex justify-center items-center ${theme.palette.mode === 'dark' ? 'dark-mode' : ''}`}>
        <div className={`max-w-md w-full p-8 rounded shadow-lg ${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <Typography variant="h3" sx={{ mb: 4 }}>Welcome to Cheth</Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Enter your lichess username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'transparent', '& input': { color: theme.palette.mode === 'dark' ? 'white' : 'inherit' } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Check Eligibility
            </Button>
          </form>
          {isEligible !== null && (
            <Typography variant="body2" className="mt-4">
              {isEligible ? 'You are eligible to join' :
                `You are not eligible to join because: ${reason}`
              }
            </Typography>
          )}
        </div>
      </div>
    </Container>
  );
}

export default LandingPage;
