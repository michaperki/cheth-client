import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, Box } from '@mui/material';
import MatchupPodium from '../game/MatchUpPodium';
import { useTheme } from '@mui/material/styles';

const GameCompleteScreen = ({ onRematch }) => {
  const theme = useTheme();
  const userInfo = useSelector(state => state.user.userInfo);
  const { currentGame: gameInfo } = useSelector(state => state.game);
  const { winner } = useSelector(state => state.gameState);

  const isUserWinner = userInfo && winner && userInfo.username === winner;
  const winnerUsername = winner === 'Draw' ? 'Draw' : winner;

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Game Complete
      </Typography>
      
      <Typography variant="h4" className="game-id" sx={{ mb: 3 }}>
        Game ID: {gameInfo?.game_id}
      </Typography>

      {gameInfo && (
        <>
          <MatchupPodium winner={winner} />
          
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            {winner === 'Draw' ? "It's a draw!" : `Winner: ${winnerUsername}`}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {isUserWinner ? 'Congratulations! You won!' : (winner === 'Draw' ? 'Good game!' : 'Better luck next time!')}
          </Typography>
          
          <Button onClick={onRematch} variant="contained" color="primary">
            Rematch
          </Button>
        </>
      )}
    </Box>
  );
};

export default GameCompleteScreen;
