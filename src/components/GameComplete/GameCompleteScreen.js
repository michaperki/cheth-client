import React from 'react';
import { Typography, Button } from '@mui/material';

const GameCompleteScreen = ({ playerOne, playerTwo, winner, userInfo, onRematch }) => {
  const isUserWinner = userInfo && winner && userInfo.username === winner;
  const winnerUsername = winner === playerOne?.username ? playerOne?.username : playerTwo?.username;

  return (
    <div>
      <Typography variant="h4">
        Game Complete
      </Typography>
      <Typography variant="h5">
        {winner ? `Winner: ${winnerUsername}` : 'It\'s a draw!'}
      </Typography>
      <Typography variant="body1">
        {isUserWinner ? 'Congratulations! You won!' : 'Better luck next time!'}
      </Typography>
      <Button onClick={onRematch} variant="contained" color="primary">
        Rematch
      </Button>
    </div>
  );
};

export default GameCompleteScreen;
