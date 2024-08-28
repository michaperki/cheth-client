import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GameCompleteScreen = ({ winner, userInfo, onRematchRequest }) => {
    const navigate = useNavigate();

    const isWinner = winner === userInfo.username;

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Game Complete
            </Typography>
            <Typography variant="h5" gutterBottom>
                {isWinner ? "Congratulations! You won!" : `${winner} won the game.`}
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" onClick={onRematchRequest} sx={{ mr: 2 }}>
                    Request Rematch
                </Button>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

export default GameCompleteScreen;
