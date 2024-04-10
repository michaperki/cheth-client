import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useCheckEligibility } from '../hooks'; // Custom hook for eligibility check

function LandingPage({ userInfo }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { isEligible, reason, checkEligibility } = useCheckEligibility(); // Use custom hook

  // Redirect to dashboard if user info is present
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await checkEligibility(username, navigate);
  };

  return (
    <StyledContainer>
      <StyledBox>
        <Typography variant="h3" sx={{ mb: 4 }}>Welcome to Cheth</Typography>
        <EligibilityForm username={username} setUsername={setUsername} handleSubmit={handleSubmit} />
        {isEligible !== null && (
          <EligibilityMessage isEligible={isEligible} reason={reason} />
        )}
      </StyledBox>
    </StyledContainer>
  );
}

const StyledContainer = (props) => (
  <Container maxWidth="md" {...props} sx={{ py: 8, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', ...props.sx }} />
);

const StyledBox = (props) => (
  <Box {...props} sx={{ maxWidth: 'md', width: '100%', p: 4, borderRadius: 2, boxShadow: 5, bgcolor: 'background.paper', color: 'text.primary', textAlign: 'center', ...props.sx }} />
);

const EligibilityForm = ({ username, setUsername, handleSubmit }) => (
  <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <TextField
      label="Enter your lichess username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      variant="outlined"
      fullWidth
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', '& input': { color: 'inherit' } }}
    />
    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ '&:hover': { bgcolor: 'primary.dark' } }}>
      Check Eligibility
    </Button>
  </form>
);

const EligibilityMessage = ({ isEligible, reason }) => (
  <Typography variant="body2" sx={{ mt: 2 }}>
    {isEligible ? 'You are eligible to join' : `You are not eligible to join because: ${reason}`}
  </Typography>
);

export default LandingPage;
