import React from 'react';
import { Typography, Button, Box } from '@mui/material';

const GameCompleteScreen = ({ winner, gameInfo, player_one, player_two, onRematch, onExit }) => {
  // Check if the necessary data is available before rendering
  if (!gameInfo || !player_one || !player_two) {
    return <Typography>Loading game information...</Typography>;
  }

  const winnerUsername = winner === player_one.user_id ? player_one.username : player_two.username;

  return (
    <Box sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Game Complete
      </Typography>
      <Typography variant="h5" gutterBottom>
        Winner: {winnerUsername}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={onRematch} sx={{ mr: 2 }}>
          Rematch
        </Button>
        <Button variant="outlined" color="secondary" onClick={onExit}>
          Exit
        </Button>
      </Box>
    </Box>
  );
};

export default GameCompleteScreen;
