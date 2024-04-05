import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
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
    <Container maxWidth="md" sx={{ py: 8, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{
          maxWidth: 'md',
          width: '100%',
          p: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[5],
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" sx={{ mb: 4 }}>Welcome to Cheth</Typography>
        <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Enter your lichess username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', '& input': { color: 'inherit' } }}
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
          <Typography variant="body2" sx={{ mt: 2 }}>
            {isEligible ? 'You are eligible to join' :
              `You are not eligible to join because: ${reason}`
            }
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default LandingPage;